import ffmpeg from 'fluent-ffmpeg'
// import libffmpeg from '@ffmpeg-installer/ffmpeg'
import libffprobe from '@ffprobe-installer/ffprobe'
import fs from "fs";
import {removeDir, removeFile, renameFile} from "../filesystem";

// ffmpeg.setFfmpegPath(libffmpeg.path); // в библиотеке из npm не поддерживаются некоторые функции
ffmpeg.setFfmpegPath("lib-ffmpeg\\ffmpeg.exe"); //поэтому берем более новую и подключаем вручную
ffmpeg.setFfprobePath(libffprobe.path);// в этой бибилиотеке работает все поэтому оставляем NPM

const getPathOut = path => {
    const arrDir = path.split(/\\|\//);
    arrDir[arrDir.length - 1] = '_' + arrDir.at(-1)
    return arrDir.join('\\')
};
const getDuration = async (path): Promise<number> => new Promise((resolve, reject) => ffmpeg(path).ffprobe((err, metadata) => !err ? resolve(+metadata.streams[0].duration) : reject(err)))
const getFrames = async (path): Promise<number> => new Promise((resolve, reject) => ffmpeg(path).ffprobe((err, metadata) => !err ? resolve(+metadata.streams[0].nb_frames) : reject(err)))
const getDataVideo = async (path) => new Promise((resolve, reject) => ffmpeg(path).ffprobe((err, metadata) => !err ? resolve(metadata) : reject(err)))

function getAspectRatio(width, height, div = 'x') {
    // Находим наибольший общий делитель (НОД) для ширины и высоты
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }

    const divisor = gcd(width, height);
    const aspectWidth = width / divisor;
    const aspectHeight = height / divisor;

    return `${aspectWidth}${div}${aspectHeight}`;
}

const videoFromImage = async ({
                                  pathInput, pathOut, dur = 5, fps = 30, scale = 1.2, w = 1920, h = 1080, clb
                              }) => new Promise<void>((resolve, reject) => ffmpeg(pathInput)
    .inputOption(["-vsync 0",/* "-hwaccel nvdec",*//* "-hwaccel cuvid",*/ "-hwaccel_device 0"])
    // .size('1920x1080').autopad('#cc0000').keepPixelAspect()
    .videoFilter(`scale=${w * 4}x${h * 4}:force_original_aspect_ratio=decrease,zoompan=z='min(zoom+${scale - 1}/(${fps}*${dur}),${scale})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${fps}*${dur}:fps=${fps},setsar=ratio=(1/1),setdar=ratio=(${getAspectRatio(w, h, '/')}),scale=${w}:${h}`)
    .outputOptions('-c:v libx264')
    .output(pathOut)
    .on('start', (command) => clb && clb('start', 'VideoFromImage: ' + command))
    .on('progress', ({frames}) => clb && clb('progress', Math.trunc(frames / (fps * dur) * 100)))
    .on('end', () => {
        clb && clb('end', 'Обработка завершена');
        resolve()
    })
    .on('error', (err) => {
        console.error('Ошибка:', err)
        clb && clb('error', err);
        reject(err)
    })
    .run());

async function getArrDataVideo(arrPath) {
    const promiseArrDataVideo = arrPath.map(path => getDataVideo(path));
    // @ts-ignore
    const arrDataVideo = (await Promise.allSettled(promiseArrDataVideo)).map(it => it.value)
    return arrDataVideo.map(dataVideo => {
        const duration = dataVideo.streams[0].duration;
        const frames = dataVideo.streams[0].nb_frames;
        return {duration, frames};
    });
}

async function videoConcat({arrPath, pathOut, maxDuration, tmTrans, clb}) {
    return new Promise<void>(async (resolve, reject) => {
        let out, outa;
        const arrDurFrame = await getArrDataVideo(arrPath);
        const frameAll = arrDurFrame.reduce((acc, {frames}) => acc + frames, 0)

        const getBlendFilter = (n, dur, offset) => {
            let in1 = n === 0 ? n + ':v' : (out ?? 'v0');
            let in2 = n === 0 ? n + 1 + ':v' : n + 1 + ':v';
            // let ina1 = n === 0 ? n + ':a' : (outa ?? 'a0');
            // let ina2 = n === 0 ? n + 1 + ':a' : n + 1 + ':a';

            out = 'v' + n;
            outa = 'a' + n;
            // return `[${in1}][${in2}]xfade=transition=fade:duration=${dur}:offset=${offset}[${out}]; [${ina1}][${ina2}]acrossfade=d=0[${outa}]`;
            return `[${in1}][${in2}]xfade=transition=fade:duration=${dur}:offset=${offset}[${out}]`;
        };

        let ff = ffmpeg()

        arrPath.forEach(path => ff.input(path))
        const _arr = Array(arrPath.length - 1).fill(null); // для цикла
        let arrOffset = _arr.map((it, i) => arrDurFrame.slice(0, i + 1).reduce((acc, {duration}) => acc + duration - tmTrans, 0));// offset
        ff.complexFilter(_arr.map((it, i) => getBlendFilter(i, tmTrans, arrOffset[i])))

        // ff.complexFilter([
        //     getBlendFn(0, 1, 4), getBlendFn(1, 1, 8),
        //     '[0][1]xfade=transition=wipeleft:duration=1:offset=4[v2]',
        //     '[v2][2]xfade=transition=wipeleft:duration=1:offset=8[vout]',
        // ])

        // ff.outputOptions(['-c:v libx264', `-map [${out}]`, `-map [${outa}]`])
        ff.outputOptions(['-c:v libx264', `-map [${out}]`])

        // ff.inputOption(["-vsync 0", "-hwaccel_device 0"]);
        if (maxDuration) ff.duration(maxDuration);
        ff.output(pathOut)
            // .on('stderr', (data) => console.log(data))
            .on('start', (command) => {
                console.warn(command)
                return clb && clb('start', 'VideoConcat: ' + command);
            })
            .on('progress', ({frames}) => clb && clb('progress', Math.trunc(frames / frameAll * 100)))
            .on('end', () => {
                clb && clb('end', 'Обработка завершена');
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
            .run();
    })
}

const buildVideo = async ({
                              arrPath, pathOut = 'out.mp4',
                              duration, fps = 30, scale = 2, tmTrans = 2, secPerFrame = 5, w, h,
                              clb
                          }) => {//ожидается что первым фреймом будет title

    console.time();

    const dir = arrPath[0].split(/\\|\//).reverse().slice(1).reverse().join('\\')

    function getArrImgPathForDur(deltaDur, secPerFrame, arrImagePath) {
        const quantImg = Math.ceil(Math.abs(deltaDur) / secPerFrame)
        if (deltaDur > 0) {//нехватка
            const addArrImgPath = Array(Math.ceil(quantImg / arrImagePath.length) + 1).fill(arrImagePath.slice(1)).flat().splice(0, quantImg);
            return [...arrImagePath, ...addArrImgPath]
        } else if (deltaDur < 0) {//избыток
            return [...arrImagePath.slice(0, arrImagePath.length - quantImg)]
        } else if (deltaDur === 0) {
            return arrImagePath;
        }
    }

    const arrVideoPath = arrPath.filter(path => path.split('.').at(-1) === 'mp4');
    let arrImagePath = arrPath.filter(path => path.split('.').at(-1) === 'png');

    if (duration) {//если задана длительность расчитываем количество картинок
        const arrDurFrame = await getArrDataVideo(arrVideoPath);
        const durVideoAll = arrDurFrame.reduce((acc, {duration}) => acc + duration, 0)

        const durImageAll = arrImagePath.length * secPerFrame;

        const shortageDur = duration - (durVideoAll + durImageAll);
        arrImagePath = getArrImgPathForDur(shortageDur, secPerFrame, arrImagePath);
    }

    let tmp_dir = dir + `\\tmp\\`;
    if (!fs.existsSync(tmp_dir)) fs.mkdirSync(tmp_dir, {recursive: true});

    let _prc = -1;
    const promiseArrTaskVideoGen = arrImagePath.map((pathImg, i) => videoFromImage({
        pathInput: pathImg,
        pathOut: tmp_dir + i + '.mp4',
        dur: secPerFrame + tmTrans,
        fps,
        scale: i === 0 ? 1 : scale,
        w,
        h,
        clb: (type, data) => {
            if (type === 'progress' && data > _prc) {
                clb && clb(type, Math.trunc((data ?? 0) * .5))
                _prc = data;
            }
        }
    }))

    await Promise.allSettled(promiseArrTaskVideoGen);

    const arrVideoPathFull = [tmp_dir + '0.mp4', ...arrVideoPath, ...arrImagePath.slice(1).map((_, i) => tmp_dir + (i + 1) + '.mp4')]

    await videoConcat({
        arrPath: arrVideoPathFull, pathOut, maxDuration: duration, tmTrans, clb: (type, data) => {
            if (type === 'start') clb && clb(type, 'BuildVideo: ' + data)
            if (type === 'progress') clb && clb(type, Math.trunc((data ?? 50) * .5 + 50))
            if (type === 'end') clb && clb('progress', 100)
        }
    })

    await removeDir(tmp_dir);

    console.timeEnd();
}

const concatAudio = async ({arrPath, pathOut, clb}) => {
    return new Promise<void>(async (resolve, reject) => {
        const ff = ffmpeg();

        arrPath.forEach(path => ff.input(path))

        ff
            .on('start', (command) => clb && clb('start', 'ConcatAudio:' + command))
            .on('end', () => {
                clb && clb('end', 'Обработка завершена');
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
            .mergeToFile(pathOut); // Указываем выходной файл
    })
}

const addTextToVideo = async ({path, arrText, clb}) => {
    return new Promise<void>(async (resolve, reject) => {
        const pathOut = getPathOut(path)

        const framesAll: number = await getFrames(path) ?? 1

        const ff = ffmpeg(path)

        let arrTextCmd = arrText.map((it) => {
            const {text, pos = {x: '10', y: 'H-th-10'}, param = {size: 14, color: 'white'}} = it;
            return `drawtext=text='${text}':font='Arial':fontcolor=black:fontsize=${param.size}:x=${pos.x}+1:y=${pos.y}+1,drawtext=text='${text}':font='Arial':fontcolor=${param.color}:fontsize=${param.size}:x=${pos.x}:y=${pos.y}`;
        });

        ff.inputOption(["-vsync 0", "-hwaccel_device 0"]);
        ff.audioCodec('copy')
        ff.complexFilter(arrTextCmd)

        ff
            .output(pathOut)
            .on('start', (command) => clb && clb('start', 'AddTextToVideo: ' + command))
            .on('progress', ({frames}) => {
                clb && clb('progress', Math.ceil(frames / framesAll * 100));
            })
            .on('end', async () => {
                clb && clb('end', 'Обработка завершена');
                await removeFile(path);
                await renameFile(pathOut, path);
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
            .run();

    })
}

const addImageToVideo = async ({path, pathImg, w = 100, h = 100, x = 'W-w-10', y = 'H-h-10', from = 0, to, clb}) => {
    return new Promise<void>(async (resolve, reject) => {
        const pathOut = getPathOut(path)

        const framesAll = await getFrames(path)
        const ff = ffmpeg()
        // - filter_complex
        // "[1:v]scale=${w}:${h}[overlay];[0:v][overlay] overlay=${x}:${y}:${to ? `enable='between(t,${from ?? 0},${to})'` : ''}" \
        ff
            .input(path)
            .input(pathImg)
            .inputOption(["-vsync 0", "-hwaccel_device 0"])
            .complexFilter([{filter: 'scale', inputs: '1', outputs: 'img'}, {
                filter: 'overlay', inputs: ['0', 'img'], options: {
                    x, y, //enable: to ? `between(t,${from ?? 0},${to})` : undefined
                }
            }])
            .output(pathOut)
            // .on('stderr', (data) => console.log(data))
            .on('start', (command) => clb && clb('start', 'AddImageToVideo: ' + command))
            .on('progress', ({frames}) => clb && clb('progress', Math.ceil(frames / framesAll * 100)))
            .on('end', async () => {
                clb && clb('end', 'Обработка завершена');
                await removeFile(path);
                await renameFile(pathOut, path);
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
            .run();

    })
}
const mergeVideoAudio = async ({pathv, patha, replace = true, fps = 25, clb}) => {
    return new Promise<void>(async (resolve, reject) => {

        const pathOut = getPathOut(pathv)

        const ff = ffmpeg()

        ff
            .addInput(pathv)
            .addInput(patha)
            .inputOption(["-vsync 0", "-hwaccel_device 0"])

        if (replace) {
            ff.addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
        } else {
            ff
                .inputOptions(['-stream_loop', '-1'])
                .complexFilter([{filter: 'volume', options: {volume: .5}, inputs: '0:a', outputs: 'a0'},
                    {filter: 'volume', options: {volume: .3}, inputs: '1:a', outputs: 'a1'},
                    {filter: 'amerge', options: {inputs: 2}, inputs: ['a0', 'a1'], outputs: 'a'},
                    // {filter: 'pan', options: {args: 'stereo|c0=FL+FR|c1=FL+FR'}, inputs: 'a', outputs: 'stereo_audio'},
                    {
                        filter: 'loudnorm', options: {
                            // loudnorm=I=-16:LRA=11:TP=-1.5
                            I: -16, // Целевой уровень интегральной громкости (LUFS) для YouTube
                            LRA: 7, // Целевой диапазон громкости (LU) для YouTube
                            tp: -1.0, // Целевой пиковый уровень (дБ)
                            // I: -12, // Целевой уровень интегральной громкости (LUFS) для YouTube
                            // LRA: 14, // Целевой диапазон громкости (LU) для YouTube
                            // tp: -1, // Целевой пиковый уровень (дБ)
                            // I: -14, // Целевой уровень интегральной громкости (LUFS) для YouTube
                            // LRA: 7, // Целевой диапазон громкости (LU) для YouTube
                            // tp: -1.5, // Целевой пиковый уровень (дБ)
                            // measured_I: -14, // Измеренный уровень интегральной громкости (LUFS)
                            // measured_LRA: 7, // Измеренный диапазон громкости (LU)
                            // measured_tp: -1.5, // Измеренный пиковый уровень (дБ)
                            // measured_thresh: -31.5, // Измеренный порог (дБ)
                            // offset: 0.0, // Смещение (дБ)
                            // linear: true, // Линейная нормализация
                            // print_format: 'json' // Формат вывода
                        }, inputs: 'a', outputs: 'norm_a'
                    }
                ])
                .outputOptions(['-map 0:v', '-map [norm_a]', '-c:v copy', '-c:a aac', '-ac 2'])
        }

        ff
            .fps(fps)
            .output(pathOut, "./temp")
            .on('stderr', (data) => console.log(data))
            .on('start', (command) => clb && clb('start', 'MergeVideoAudio: ' + command))
            .on('progress', ({percent}) => clb && clb('progress', Math.ceil(percent)))
            .on('end', async () => {
                clb && clb('progress', 100);
                clb && clb('end', 'Обработка завершена');
                await removeFile(pathv);
                await renameFile(pathOut, pathv);
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
            .run();

    })
}

async function concatMediaFiles({arrPath, pathOut, fps = 25, clb}) {
    return new Promise<void>(async (resolve, reject) => {
        let path = arrPath.find(it => it === pathOut) ? getPathOut(pathOut) : pathOut;

        const ff = ffmpeg();

        const arrVideoData = (await Promise.allSettled(arrPath.map(async path => {
            ff.input(path)
            return await getDataVideo(path)
        })))
        // @ts-ignore
        arrVideoData.map(({value}) => value);

        // @ts-ignore
        const isAudioExist = arrVideoData[0].streams[1].codec_type === 'audio';

        // @ts-ignore
        const framesAll = arrVideoData.reduce((acc, {streams}) => acc + streams[0].nb_frames, 0)

        ff
            .complexFilter([{filter: 'concat', options: {n: arrPath.length, v: 1, a: isAudioExist ? 1 : 0}}])
            .fps(fps)
            .save(path)
            // .on('stderr', (data) => console.log(data))
            .on('start', (command) => clb && clb('start', 'ConcatMediaFiles: ' + command))
            .on('progress', ({frames}) => {
                clb && clb('progress', Math.ceil(frames / framesAll * 100));
            })
            .on('end', async () => {
                clb && clb('progress', 100);
                clb && clb('end', 'Обработка завершена');
                if (path !== pathOut) {
                    await removeFile(pathOut);
                    await renameFile(path, pathOut);
                }
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
    });
}

const monoToStereoAudio = async ({path, clb}) => {
    return new Promise<void>(async (resolve, reject) => {

        const pathOut = getPathOut(path)

        const ff = ffmpeg();

        ff
            .addInput(path)

        ff
            .audioFilters('pan=stereo|c0=c0|c1=c0') // Дублирует канал для стерео
            .output(pathOut)
            .on('stderr', (data) => console.log(data))
            .on('start', (command) => clb && clb('start', 'monoToStereoAudio: ' + command))
            .on('progress', ({percent}) => clb && clb('progress', Math.ceil(percent)))
            .on('end', async () => {
                clb && clb('progress', 100);
                clb && clb('end', 'Обработка завершена');
                await removeFile(path);
                await renameFile(pathOut, path);
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка:', err);
                clb && clb('error', err);
                reject(err);
            })
            .run();

    })
}

export const createAnVideo = async ({
                                        pathSpeech, pathBridge, pathAudio, arrPathImg, pathVideo,
                                        w, h, textSrcNews, textAdd, pathLogo, fps,
                                        clb
                                    }) => {
    try {
        await monoToStereoAudio({path: pathSpeech, clb: (type, mess) => console.log(type, mess)})

        await concatAudio({
            arrPath: [pathSpeech, pathBridge],
            pathOut: pathAudio,
            clb: (type, mess) => console.log(type, mess)
        })
        const duration = await getDuration(pathAudio)
        await buildVideo({
            arrPath: arrPathImg,
            pathOut: pathVideo,
            duration,
            tmTrans: 1,
            secPerFrame: 5,
            fps,
            scale: 1.3,
            w,
            h,
            clb
        })

        let arrText = [{
            text: 'источник\\\: ' + textSrcNews,
            pos: {x: '10', y: 'H-th-10'},
            param: {size: 15, color: 'white'}
        }];
        if (textAdd) arrText.push({text: textAdd, pos: {x: '10', y: '10'}, param: {size: 20, color: 'white'}})
        await addTextToVideo({path: pathVideo, arrText: arrText, clb})

        await mergeVideoAudio({pathv: pathVideo, patha: pathAudio, replace: true, clb})

        // @ts-ignore
        await addImageToVideo({path: pathVideo, pathImg: pathLogo, y: '10', w: 100, h: 70, clb})

        return duration;
    } catch (e) {
        throw e;
    }
}

export const createAllVideo = async ({arrPathVideo, pathBackground, pathIntro, pathEnd, pathOut, fps, clb}) => {
    try {
        await concatMediaFiles({arrPath: arrPathVideo, pathOut, fps, clb})

        await mergeVideoAudio({pathv: pathOut, patha: pathBackground, replace: false, fps, clb})

        await concatMediaFiles({arrPath: [pathIntro, pathOut, pathEnd], pathOut, fps, clb})

    } catch (e) {
        throw e;
    }

}

// примеры использования
// let dir = process.cwd() + '\\tst';

// await videoFromImage({
//     pathInput: dir + '\\input1.png',
//     pathOut: dir + '\\out.mp4',
//     scale: 2,
//     dur: 1,
//     w: 1920,
//     h: 1080,
//     fps: 25,
//     clb: (type, data) => {
//         console.log(type, data)
//     }
// })

// await concatAudio({
//     arrPath: [dir + '\\speech1.mp3', dir + '\\speech2.mp3'], pathOut: dir + '\\out.mp3', clb: (type, mess) => console.log(type, mess)
// })

// await buildVideo({
//     arrPath: Array(4).fill().map((_, i) => dir + '\\input' + i + '.png'),
//     duration: 27,
//     tmTrans: 2,
//     secPerFrame: 3,
//     fps: 1,
//     scale: 1.5,
//     clb: (type, prc) => type === 'progress' && console.log(prc)
// })

// await addTextToVideo({
//     path: dir + '\\out.mp4',
//     pathOut: dir + '\\out1.mp4',
//     arrText: [{text: 'источник\\\: dsngkjn fkjg k', pos: {x: '10', y: 'H-th-10'}, param: {size: 30, color: 'white'}}],
//     clb: (type, mess) => console.log(mess)
// })

// await mergeVideoAudio({pathv: dir + '\\out.mp4', patha: dir + '\\speech2.mp3', clb: (type, mess) => console.log(mess)})
// await addImageToVideo({path: dir + '\\out.mp4', pathImg: dir + '\\logo.png', y: '10', w: 100, h: 70, clb: (type, mess) => console.log(mess)})
// await mergeVideoAudio({pathv: dir + '\\out.mp4', patha: dir + '\\speech1.mp3', clb: (type, mess) => console.log(mess)})

// await concatMediaFiles({
//     arrPath: [dir + '\\1out.mp4', dir + '\\2out.mp4'],
//     pathOut: dir + '\\123.mp4',
//     clb: (type, mess) => console.log(mess)
// })

// await videoConcat({
//     arrPath: [dir + '\\1out.mp4', dir + '\\2out.mp4'],
//     pathOut: dir + '\\123.mp4',
//     // arrPath: [dir + '\\input0.png', dir + '\\input1.png'],
//     maxDuration: 56,
//     tmTrans: 0,
//     clb: (type, prc) => console.log(prc)
// })