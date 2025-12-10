// https://github.com/greenina/greenina.github.io/blob/main/src/Components/projectEntry.js

const PrjBtn = ({ type, href, text }) => {
    let imgSrc; 

    switch (type) {
        case 'code':
            imgSrc = '/icons/github-logo.png';
            break;
        case 'website': // 요런 건 그대로 따 와도 괜찮겟다
            imgSrc = '/icons/web-icon.png';
            break;
        case 'video':
            imgSrc = '/icons/video-icon.png';
            break;
        case 'pdf':
            imgSrc = '/icons/pdf-icon.png';
            break;
        default:
            imgSrc = '/icons/link-icon.png';
            break;
    }
    return (
        <a
            href={href}
            className="flex items-center gap-1 py-1 text-black text-sm hover:underline hover:font-semibold hover:text-[#68A5B3]"
             
    )
}