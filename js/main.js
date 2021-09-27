(() => {
    let pageScrollY = 0
    let prevScrollHeight = 0;
    let currentScene = 0;
    const sceneInfo = [
        {
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messages: document.querySelectorAll('#scroll-section-0 .message'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            styles: {
                imageCount: 300,
                imageSequence: [0, 299],
                canvas_opcaity: [1, 0, { start: 0.9, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },
        {
            type: 'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            }
        },
        {
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messages: document.querySelectorAll('#scroll-section-2 .message'),
                pin: document.querySelectorAll(".pin"),
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages: []
            },
            styles: {
                imageCount: 960,
                imageSequence: [0, 959],
                canvas_opcaity_in: [0, 1, { start: 0, end: 0.07 }],
                canvas_opcaity_out: [1, 0, { start: 0.95, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.25 }],
                messageB_opacity_in: [0, 1, { start: 0.4, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.7, end: 0.85 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.25 }],
                messageB_translateY_in: [20, 0, { start: 0.4, end: 0.55 }],
                messageC_translateY_in: [20, 0, { start: 0.7, end: 0.85 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.4 }],
                messageB_opacity_out: [1, 0, { start: 0.6, end: 0.7 }],
                messageC_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.4 }],
                messageB_translateY_out: [0, -20, { start: 0.6, end: 0.7 }],
                messageC_translateY_out: [0, -20, { start: 0.9, end: 0.95 }],
                pinA_scaleY: [50, 100, { start: 0.4, end: 0.6 }],
                pinB_scaleY: [50, 100, { start: 0.7, end: 0.9 }],

            }
        },
        {
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('#scroll-section-3 .image-blend-canvas'),
                context: document.querySelector('#scroll-section-3 .image-blend-canvas').getContext('2d'),
                imagePaths: [
                    './images/blend-image-1.jpg', './images/blend-image-2.jpg'
                ],
                images: []
            }
        },
    ];

    function setLayout() {
        console.log('set layout')
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.clientHeight
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }
        let totalScrollHeight = 0;
        pageScrollY = window.scrollY
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= pageScrollY) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        // sceneInfo[0].objs.canvas.style.opacity = "1";

        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function playAnimation() {
        const styles = sceneInfo[currentScene].styles;
        const objs = sceneInfo[currentScene].objs;
        const scrollY_bySection = pageScrollY - prevScrollHeight;
        const scrollRatio = scrollY_bySection / sceneInfo[currentScene].scrollHeight;

        switch (currentScene) {
            case 0:
                sceneInfo[0].objs.canvas.style.opacity = calcValues(sceneInfo[0].styles.canvas_opcaity, scrollY_bySection);
                const progressA = Math.round(calcValues(styles.imageSequence, scrollY_bySection));
                objs.context.drawImage(objs.videoImages[progressA], 0, 0);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messages[0].style.opacity = calcValues(styles.messageA_opacity_in, scrollY_bySection);
                    objs.messages[0].style.transform = `translate3d(0, ${calcValues(styles.messageA_translateY_in, scrollY_bySection)}%, 0)`;
                } else {
                    // out
                    objs.messages[0].style.opacity = calcValues(styles.messageA_opacity_out, scrollY_bySection);
                    objs.messages[0].style.transform = `translate3d(0, ${calcValues(styles.messageA_translateY_out, scrollY_bySection)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messages[1].style.opacity = calcValues(styles.messageB_opacity_in, scrollY_bySection);
                    objs.messages[1].style.transform = `translate3d(0, ${calcValues(styles.messageB_translateY_in, scrollY_bySection)}%, 0)`;
                } else {
                    // out
                    objs.messages[1].style.opacity = calcValues(styles.messageB_opacity_out, scrollY_bySection);
                    objs.messages[1].style.transform = `translate3d(0, ${calcValues(styles.messageB_translateY_out, scrollY_bySection)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messages[2].style.opacity = calcValues(styles.messageC_opacity_in, scrollY_bySection);
                    objs.messages[2].style.transform = `translate3d(0, ${calcValues(styles.messageC_translateY_in, scrollY_bySection)}%, 0)`;
                } else {
                    // out
                    objs.messages[2].style.opacity = calcValues(styles.messageC_opacity_out, scrollY_bySection);
                    objs.messages[2].style.transform = `translate3d(0, ${calcValues(styles.messageC_translateY_out, scrollY_bySection)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messages[3].style.opacity = calcValues(styles.messageD_opacity_in, scrollY_bySection);
                    objs.messages[3].style.transform = `translate3d(0, ${calcValues(styles.messageD_translateY_in, scrollY_bySection)}%, 0)`;
                } else {
                    // out
                    objs.messages[3].style.opacity = calcValues(styles.messageD_opacity_out, scrollY_bySection);
                    objs.messages[3].style.transform = `translate3d(0, ${calcValues(styles.messageD_translateY_out, scrollY_bySection)}%, 0)`;
                }

                break;
            case 2:
                const [pinA, pinB] = objs.pin;

                const progressB = Math.round(calcValues(styles.imageSequence, scrollY_bySection));
                objs.context.drawImage(objs.videoImages[progressB], 0, 0);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(styles.canvas_opcaity_in, scrollY_bySection);
                } else {
                    objs.canvas.style.opacity = calcValues(styles.canvas_opcaity_out, scrollY_bySection);
                }

                if (scrollRatio <= 0.27) {
                    // in
                    objs.messages[0].style.opacity = calcValues(styles.messageA_opacity_in, scrollY_bySection);
                    objs.messages[0].style.transform = `translate3d(0, ${calcValues(styles.messageA_translateY_in, scrollY_bySection)}%, 0)`;
                } else {
                    // out
                    objs.messages[0].style.opacity = calcValues(styles.messageA_opacity_out, scrollY_bySection);
                    objs.messages[0].style.transform = `translate3d(0, ${calcValues(styles.messageA_translateY_out, scrollY_bySection)}%, 0)`;
                }
    
                if (scrollRatio <= 0.57) {
                    // in
                    objs.messages[1].style.opacity = calcValues(styles.messageB_opacity_in, scrollY_bySection);
                    objs.messages[1].style.transform = `translate3d(0, ${calcValues(styles.messageB_translateY_in, scrollY_bySection)}%, 0)`;
                    pinA.style.transform = `scaleY(${calcValues(styles.pinA_scaleY, scrollY_bySection)}%)`
                } else {
                    // out
                    objs.messages[1].style.opacity = calcValues(styles.messageB_opacity_out, scrollY_bySection);
                    objs.messages[1].style.transform = `translate3d(0, ${calcValues(styles.messageB_translateY_out, scrollY_bySection)}%, 0)`;
                }
    
                if (scrollRatio <= 0.87) {
                    // in
                    objs.messages[2].style.opacity = calcValues(styles.messageC_opacity_in, scrollY_bySection);
                    objs.messages[2].style.transform = `translate3d(0, ${calcValues(styles.messageC_translateY_in, scrollY_bySection)}%, 0)`;
                    pinB.style.transform = `scaleY(${calcValues(styles.pinB_scaleY, scrollY_bySection)}%)`
                } else {
                    // out
                    objs.messages[2].style.opacity = calcValues(styles.messageC_opacity_out, scrollY_bySection);
                    objs.messages[2].style.transform = `translate3d(0, ${calcValues(styles.messageC_translateY_out, scrollY_bySection)}%, 0)`;
                }
                break;
            case 3:
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let scale = (widthRatio <= heightRatio) ? heightRatio : widthRatio;

                objs.canvas.style.transform = `scale(${scale})`;
                console.log(objs.canvas.width * scale)
                console.log(objs.canvas.height * scale)
                objs.context.drawImage(objs.images[0], 0, 0);

                break;
            default: break;
        }
    }

    function calcValues(styleRange, currentScrollY) {
        let rv;
        const [min, max, part] = styleRange;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = (pageScrollY - prevScrollHeight) / scrollHeight;

        if (styleRange[2]) {
            const partAnimationStart = scrollHeight * part.start;
            const partAnimationEnd = scrollHeight * part.end;
            const partScrollHeight = partAnimationEnd - partAnimationStart;
            const partScrollRatio = (currentScrollY - partAnimationStart) / partScrollHeight

            if (currentScrollY >= partAnimationStart && currentScrollY <= partAnimationEnd) {
                rv = partScrollRatio * (max - min) + min;
            } else if (currentScrollY < partAnimationStart) {
                rv = min;
            } else if (currentScrollY > partAnimationEnd) {
                rv = max;
            }
        } else {
            rv = scrollRatio * (max - min) + min;
        }
        
        return rv;
    }

    function scrollLoop() {
        let isInterSection = false;
        prevScrollHeight = 0;
        

        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (pageScrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
            isInterSection = true
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (pageScrollY < prevScrollHeight) {
            if (currentScene === 0) return;
            currentScene--;
            isInterSection = true;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (!isInterSection) playAnimation();
    }

    function setCanvasImages() {
        for (let i = 0; i < sceneInfo[0].styles.imageCount; i++) {
            const imgElem = new Image();
            
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        for (let i = 0; i < sceneInfo[2].styles.imageCount; i++) {
            const imgElem = new Image();

            imgElem.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem);
        }

        sceneInfo[3].objs.imagePaths.forEach(path => {
            const imgElem = new Image();
            imgElem.src = path;
            sceneInfo[3].objs.images.push(imgElem);
        })

    };

    window.addEventListener('scroll', () => {
        pageScrollY = window.scrollY;
        scrollLoop();
    });

    window.addEventListener('resize', setLayout);
    window.addEventListener('load', () => {
        setLayout();
        if (currentScene === 0) {
            const objs = sceneInfo[currentScene].objs;
            objs.context.drawImage(objs.videoImages[0], 0, 0);
        }

    });
    setCanvasImages();
})();