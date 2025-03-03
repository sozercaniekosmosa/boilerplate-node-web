import axios from "axios";

const getMostFrequentLengthArray = (arrays) => {
    // Создаем объект для подсчета частоты длин массивов
    let _arr = Array(arrays.length * 2).fill(0);

    // Проходим по каждому массиву и подсчитываем частоту его длины
    arrays.forEach(arr => {
        const length = arr.length;
        if (_arr[length]) {
            _arr[length]++;
        } else {
            _arr[length] = 1;
        }
    });
    let maxIndex = 0;
    for (let i = 1; i < _arr.length; i++) {
        if (_arr[i] > _arr[maxIndex]) {
            maxIndex = i;
        }
    }
    return maxIndex;
}

const findClosingBrace = (str) => {
    let count = 0;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '{') {
            count++;
        } else if (str[i] === '}') {
            count--;
            if (count === 0) {
                return i;
            }
        }
    }

    if (count !== 0) {
        throw new Error('Unmatched opening brace');
    }

    return -1; // Если не найдено закрывающей скобки
}

const getImages = async (querySearch, {img_cookie, img_xbrows_valid, img_xclient}) => {
    const headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': img_cookie,
        'priority': 'u=0, i',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-arch': '"x86"',
        'sec-ch-ua-bitness': '"64"',
        'sec-ch-ua-form-factors': '"Desktop"',
        'sec-ch-ua-full-version': '"131.0.6778.205"',
        'sec-ch-ua-full-version-list': '"Google Chrome";v="131.0.6778.205", "Chromium";v="131.0.6778.205", "Not_A Brand";v="24.0.0.0"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"19.0.0"',
        'sec-ch-ua-wow64': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'x-browser-channel': 'stable',
        'x-browser-copyright': 'Copyright 2024 Google LLC. All rights reserved.',
        'x-browser-validation': img_xbrows_valid,
        'x-browser-year': '2024',
        'x-client-data': img_xclient
    };

    const qeryBuild = querySearch.split(' ').join('+')

    const queryEncode = encodeURIComponent(qeryBuild)

    const url = `https://www.google.com/search?q=${queryEncode}&udm=2&source=lnt&tbs=isz:l&sa=X`;

    try {
        const response = await axios.get(url, {headers, withCredentials: true});
        // console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Error fetching personal feed:', error);
        return null;
    }
}

export const getArrImageUrl = async (searchRequest, {img_cookie, img_xbrows_valid, img_xclient}) => {

    try {
        const html = await getImages(searchRequest, {img_cookie, img_xbrows_valid, img_xclient});
        if (html === null) throw 'ImageDownloadProcessor.getArrImage: не могу получить документ возможно нужно обновить кукисы';

        //дальше пытаемся обработать [Объект] внутри [документа] работая с ним как со строкой так быстрее

        const _pos = html.indexOf('gws-wiz-serp'); //ищем в тексте некий примитив который в данном документе встречается минимальное количество раз
        if (_pos === -1) throw 'ImageDownloadProcessor.getArrImage: скорее всего изменилась структура объекта';

        const _startPos = html.lastIndexOf('{', _pos) //теперь ищем в обратную сторону пока не встретим начало структуры (фигурная скобка)
        if (_startPos === -1) throw 'ImageDownloadProcessor.getArrImage: видимо что то пошло не так структура "съехала" или была сильно изменена';

        const _html = html.substring(_startPos)// получаем подстроку — начало структуры

        const _endPos = findClosingBrace(_html) //ищем конец струкутры переберая все уровни вложенность подструкутр
        const objText = _html.substring(0, _endPos + 1); //наконец получаем структуру как строку
        const obj = JSON.parse(objText); //парсим в объект

        const _arr = Object.values(obj) //откидываем ключи оставляем значения и представляем как массив каждый элемент которого тоже массив но об этом далее
        const _indexArr = getMostFrequentLengthArray(_arr); //находим самый часто встречающийся размер подмассива это в финале и будут массивы которые содержат ссылки на картинки
        // @ts-ignore
        const _arrImg = _arr.filter(v => v.length === _indexArr) //фильтруем подмассивы с нужно  длинной
        // @ts-ignore
        const _arrImgFlat = _arrImg.map(a => a.flat(5)) //так как каждый под массив содержит некую вложенность подмассиво делаем его плоским для удобства
        const __arrImg = _arrImgFlat.map(a => a.filter(it => (it + '').startsWith("https"))) //отыскиваем подмассивы которые содежат ссылки и мапим только их в новый массив
        return __arrImg.map(a => a.filter(it => !(it + '').startsWith("https://encrypted"))).flat(); //оставляем только прямые ссылки на кртинки

    } catch (e) {
        console.error(e)
        return null;
    }
}
