export default () => {
    let startY;
    let endY;
    document.addEventListener('touchstart', (event)  => {
        startY = event.touches[0].pageY;
    });
    document.addEventListener('touchmove', (event) => {
        endY = event.touches[0].pageY;
        console.log(event);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        console.log(scrollTop);
        console.log(clientHeight);
        console.log(document.body.scrollHeight);
        console.log(startY);
        console.log(endY);
        if( endY > startY&& scrollTop <= 0 ){
            event.preventDefault();
        }
        if( endY < startY && scrollTop + clientHeight >= document.body.scrollHeight){
            event.preventDefault();
        }
    }, {
        passive: false,
        capture: true
    });
}
