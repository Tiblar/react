export function parseMentions(text, mentions) {

    let textLength = text.length;
    let offset = 0;
    for (let mention of mentions) {
        if(mention.indices[0] > textLength){
            break;
        }

        let link = "<a href='/" + mention.user.info.username + "'>@" + mention.user.info.username + "</a>";

        text = text.substring(0, mention.indices[0] + offset) + link + text.substring(mention.indices[1] + offset)

        offset += (link.length) - (mention.indices[1] - mention.indices[0]);
    }

    return text;
}