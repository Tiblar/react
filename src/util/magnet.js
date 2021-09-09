export function validateMagnet(magnet) {
    return magnet.match(/magnet:\?xt=urn:[a-z0-9]/i) != null;
}