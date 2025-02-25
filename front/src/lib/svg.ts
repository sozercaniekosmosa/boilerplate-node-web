/**
 * rotate SVG element
 * @param svgNode that being rotating
 * @param centerX
 * @param centerY
 * @param angle
 */
export function rotateSVG(svgNode, centerX, centerY, angle) {
    var rotationTransform = svgNode.createSVGTransform();
    rotationTransform.setRotate(angle, centerX, centerY);
    svgNode.transform.baseVal.appendItem(rotationTransform);
}