const second = 1000;
const minute = 60 * second;
const style = `
position: absolute;
top: 0;
left: 0;
background-color: #d24d57;
width: 100%;
height: 2rem;
text-align: center;
line-height: 2rem;
`;

export function show(text, duration) {
    duration = duration*second || 2*minute;
    const banner = document.createElement("section");
    banner.setAttribute('style', style);
    banner.innerHTML = text;
    document.body.appendChild(banner);
    setTimeout(() => document.body.removeChild(banner), duration);
}
