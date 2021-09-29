(() => {
    let pageScrollY = 0
    let prevScrollHeight = 0;
    let currentScene = 0;
    let delayedYOffset = 0;
    let acc = 0.2;
    let rafId;
    let rafStatus;
    let isInterSection = false;
    let progress = 0

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
            },
            styles: {
                leftRectX: [0, 0, { start: 0, end: 0 }],
                rightRectX: [0, 0, { start: 0, end: 0 }],
                blendHeight: [0, 0, { start: 0, end: 0 }],
                canvasScale: [0, 0, { start: 0, end: 0 }],
                canvasCaptioOpacity: [0, 1, { start: 0, end: 0 }],
                canvasCaptioTranslateY: [20, 0, { start: 0, end: 0 }],
                rectTopY: 0,
            },
        },
    ];

    function setLayout() {
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
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[3].objs.context.fillStyle = 'white';
    }

    function playAnimation() {
        const styles = sceneInfo[currentScene].styles;
        const objs = sceneInfo[currentScene].objs;
        const scrollY_bySection = pageScrollY - prevScrollHeight;
        const scrollRatio = scrollY_bySection / sceneInfo[currentScene].scrollHeight;

        switch (currentScene) {
            case 0:
                sceneInfo[0].objs.canvas.style.opacity = calcValues(sceneInfo[0].styles.canvas_opcaity, scrollY_bySection);

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

                if (scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const styles = sceneInfo[3].styles;
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let scale = (widthRatio <= heightRatio) ? heightRatio : widthRatio;

                    objs.canvas.style.transform = `scale(${scale})`;
                    objs.context.drawImage(objs.images[0], 0, 0);

                    const recalculatedInnerWidth = document.body.offsetWidth / scale;
                    const whiteRectWidth = recalculatedInnerWidth * 0.15;

                    styles.leftRectX[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    styles.leftRectX[1] = styles.leftRectX[0] - whiteRectWidth;
                    styles.rightRectX[0] = styles.leftRectX[0] + recalculatedInnerWidth - whiteRectWidth;
                    styles.rightRectX[1] = styles.rightRectX[0] + whiteRectWidth;

                    objs.context.fillRect(parseInt(styles.leftRectX[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
                    objs.context.fillRect(parseInt(styles.rightRectX[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
                }

                break;
            case 3:
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let scale = (widthRatio <= heightRatio) ? heightRatio : widthRatio;

                objs.canvas.style.transform = `scale(${scale})`;
                objs.context.drawImage(objs.images[0], 0, 0);

                const recalculatedInnerWidth = document.body.offsetWidth / scale;

                if (!styles.rectTopY) {
                    styles.rectTopY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * scale) / 2;
                    styles.leftRectX[2].start = window.innerHeight / 3 / sceneInfo[currentScene].scrollHeight;
                    styles.rightRectX[2].start = window.innerHeight / 3 / sceneInfo[currentScene].scrollHeight;
                    styles.leftRectX[2].end = styles.rectTopY / sceneInfo[currentScene].scrollHeight;
                    styles.rightRectX[2].end = styles.rectTopY / sceneInfo[currentScene].scrollHeight;

                }
                
                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                styles.leftRectX[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                styles.leftRectX[1] = styles.leftRectX[0] - whiteRectWidth;
                styles.rightRectX[0] = styles.leftRectX[0] + recalculatedInnerWidth - whiteRectWidth;
                styles.rightRectX[1] = styles.rightRectX[0] + whiteRectWidth;

                objs.context.fillRect(parseInt(calcValues(styles.leftRectX, scrollY_bySection)), 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(parseInt(calcValues(styles.rightRectX, scrollY_bySection)), 0, parseInt(whiteRectWidth), objs.canvas.height);

                if (scrollRatio < styles.leftRectX[2].end) {
                    objs.canvas.classList.remove('sticky');
                } else {
                    objs.canvas.classList.add('sticky');

                    styles.blendHeight[0] = 0;
                    styles.blendHeight[1] = objs.canvas.height;
                    styles.blendHeight[2].start = styles.leftRectX[2].end;
                    styles.blendHeight[2].end = styles.blendHeight[2].start + 0.2;

                    const blendHeight = calcValues(styles.blendHeight, scrollY_bySection);
                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight    
                    );

                    objs.canvas.style.top = `${-((objs.canvas.height - objs.canvas.height * scale) / 2)}px`

                    if (scrollRatio > styles.blendHeight[2].end) {
                        objs.canvas.style.marginTop = 0;
                        styles.canvasScale[0] = scale;
                        styles.canvasScale[1] = document.body.offsetWidth / (objs.canvas.width * 1.5);
                        styles.canvasScale[2].start = styles.blendHeight[2].end;
                        styles.canvasScale[2].end = styles.canvasScale[2].start + 0.2;


                        objs.canvas.style.transform = `scale(${calcValues(styles.canvasScale, scrollY_bySection)})`;

                        if (scrollRatio > styles.canvasScale[2].end) {
                            objs.canvas.classList.remove('sticky');
                            objs.canvas.style.marginTop = `${sceneInfo[currentScene].scrollHeight * 0.4}px`;
                            styles.canvasCaptioOpacity[2].start = styles.canvasScale[2].end;
                            styles.canvasCaptioOpacity[2].end = styles.canvasCaptioOpacity[2].start + 0.1;
                            styles.canvasCaptioTranslateY[2].start = styles.canvasScale[2].end;
                            styles.canvasCaptioTranslateY[2].end = styles.canvasCaptioTranslateY[2].start + 0.2;
                            
                            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(styles.canvasCaptioTranslateY, scrollY_bySection)}%, 0)`;
                            objs.canvasCaption.style.opacity = calcValues(styles.canvasCaptioOpacity, scrollY_bySection);
                        }
                    }
                }

                break;
            default: break;
        }
    }

    function calcValues(styleRange, currentScrollY) {
        let rv;
        const [min, max, part] = styleRange;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentScrollY / scrollHeight;

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
        prevScrollHeight = 0;
        isInterSection = false;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
            isInterSection = true
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (delayedYOffset && delayedYOffset < prevScrollHeight) {
            if (currentScene === 0) return;
            currentScene--;
            isInterSection = true;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (!isInterSection) playAnimation();
    }

    function requestAnimationFrameHandler() {
        delayedYOffset = delayedYOffset + (pageScrollY - delayedYOffset) * acc;
        if (currentScene === 0 || currentScene === 2) {
            if (!isInterSection) {
                const styles = sceneInfo[currentScene].styles;
                const objs = sceneInfo[currentScene].objs;
                const scrollY_bySection = delayedYOffset - prevScrollHeight;
                progress = Math.round(calcValues(styles.imageSequence, scrollY_bySection));
                if (objs.videoImages[progress]){
                    objs.context.drawImage(objs.videoImages[progress], 0, 0);
                }
            }
        }

        rafId = requestAnimationFrame(requestAnimationFrameHandler);

        if (Math.abs(pageScrollY - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafStatus = false;
        }
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

    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');

        setLayout();
        if (currentScene === 0) {
            const objs = sceneInfo[0].objs;
            objs.context.drawImage(objs.videoImages[0], 0, 0);
        }


        window.addEventListener('scroll', () => {
            pageScrollY = window.scrollY;
            if (pageScrollY > 43) {
                document.body.classList.add('lnb-sticky');
            } else {
                document.body.classList.remove('lnb-sticky');
            }
            if (!rafStatus) {
                rafId = requestAnimationFrame(requestAnimationFrameHandler)
                rafStatus = true;
            }
            scrollLoop();

        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900 ) {
                setLayout();
                sceneInfo[3].styles.rectTopY = 0;
            } 

        });

        window.addEventListener('orientationchange', setLayout);

        document.querySelector('.loading').addEventListener('transitionend', (e) => {
            document.body.removeChild(e.currentTarget);
        });
    });
    setCanvasImages();
})();