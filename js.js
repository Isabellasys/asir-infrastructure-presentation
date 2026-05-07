/* =======================================================================
   VARIABLES GLOBALES PARA PARTICULAS DEL NÚCLEO (SLIDE 7)
   ======================================================================= */
const cBlue = '#1d4ed8';   
const cOrange = '#ea580c'; 
const cGreen = '#16a34a';  

class ParticleEngine {
    constructor() {
        this.svg = document.getElementById('svg-engine');
        this.particles = [];
        if (this.svg) this.init();
    }

    init() {
        this.createStream('p-code-git', cBlue, 0.008, 900);      
        this.createStream('p-git-ansible', cBlue, 0.005, 1100);     
        this.createStream('p-ansible-nginx', cOrange, 0.008, 1200); 
        this.createStream('p-nginx-back', cOrange, 0.004, 1000);  
        
        this.createStream('p-back-db', cGreen, 0.006, 1500, false); 
        this.createStream('p-back-db', cOrange, 0.006, 1500, true); 

        this.createStream('p-back-mqtt', cGreen, 0.005, 800);
        this.createStream('p-mqtt-out1', cGreen, 0.008, 600);
        this.createStream('p-mqtt-out2', cGreen, 0.008, 900);
        this.createStream('p-mqtt-out3', cGreen, 0.008, 1200);
        
        this.animate();
    }

    createStream(pathId, color, speed, interval, reverse = false) {
        setInterval(() => {
            const path = document.getElementById(pathId);
            const slide = document.getElementById('live-pipeline');
            if (path && slide && slide.classList.contains('active')) {
                this.spawn(path, color, speed, reverse);
            }
        }, interval + (Math.random() * 600)); 
    }

    spawn(path, color, speed, reverse) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        head.setAttribute("r", "3.5");
        head.setAttribute("fill", color);
        head.style.filter = `drop-shadow(0 0 3px ${color})`;
        group.appendChild(head);

        const trails = [];
        for(let i = 0; i < 5; i++) {
            const t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            t.setAttribute("r", 2.5 - (i * 0.4));
            t.setAttribute("fill", color);
            t.setAttribute("opacity", 0.7 - (i * 0.15));
            group.appendChild(t);
            trails.push(t);
        }

        this.svg.appendChild(group);
        this.particles.push({ 
            el: group, head: head, trails: trails, 
            path: path, len: path.getTotalLength(), 
            progress: reverse ? 1 : 0, speed: speed, reverse: reverse 
        });
    }

    animate() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.progress += p.reverse ? -p.speed : p.speed;
            
            if (p.progress > 1 || p.progress < 0) {
                this.triggerHit(p.path.id, p.reverse);
                p.el.remove();
                this.particles.splice(i, 1);
                continue;
            }
            
            const headPos = p.path.getPointAtLength(p.progress * p.len);
            p.head.setAttribute("cx", headPos.x); 
            p.head.setAttribute("cy", headPos.y);

            p.trails.forEach((trail, index) => {
                const offset = (index + 1) * 0.015;
                let tProg = p.reverse ? p.progress + offset : p.progress - offset;
                if (tProg < 0) tProg = 0; if (tProg > 1) tProg = 1;
                const trailPos = p.path.getPointAtLength(tProg * p.len);
                trail.setAttribute("cx", trailPos.x); 
                trail.setAttribute("cy", trailPos.y);
            });
        }
        requestAnimationFrame(() => this.animate());
    }

    triggerHit(pathId, isReverse) {
        const routeMap = { 
            'p-code-git': 'n-git', 'p-git-ansible': 'n-ansible', 
            'p-ansible-nginx': 'n-nginx', 'p-nginx-back': 'n-back', 
            'p-back-db': isReverse ? 'n-back' : 'n-db', 'p-back-mqtt': 'n-mqtt' 
        };
        const targetId = routeMap[pathId];
        if (!targetId) return;

        const node = document.getElementById(targetId);
        if (!node) return;

        const pulseClass = targetId === 'n-back' ? 'pulse-hit-core' : 'pulse-hit';
        node.classList.remove(pulseClass);
        void node.offsetWidth;
        node.classList.add(pulseClass);
        setTimeout(() => { if(node) node.classList.remove(pulseClass); }, 400);
    }
}

/* =======================================================================
   INICIALIZACIÓN GLOBAL Y LÓGICA DEL SLIDER
   ======================================================================= */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica del Slider Principal
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress-bar');

    function showSlide(index) {
        if(index < 0 || index >= slides.length) return;
        
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlideIndex = index;
        
        if (progressBar) progressBar.style.width = ((index + 1) / slides.length * 100) + '%';
        lucide.createIcons();
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') showSlide(currentSlideIndex + 1);
        if (e.key === 'ArrowLeft') showSlide(currentSlideIndex - 1);
    });

    let isThrottled = false;
    window.addEventListener('wheel', (e) => {
        if (isThrottled) return;
        isThrottled = true;
        if (e.deltaY > 0) showSlide(currentSlideIndex + 1);
        else if (e.deltaY < 0) showSlide(currentSlideIndex - 1);
        setTimeout(() => { isThrottled = false; }, 800); 
    });

    // Inicializamos lo básico
    lucide.createIcons();
    new ParticleEngine();
    showSlide(0);

    // =======================================================================
    // LÓGICA DE LA DIAPOSITIVA 4 (TOPOLOGÍA 2500x1080)
    // =======================================================================
    const slide4Container = document.getElementById('slide4-container');
    
    if (slide4Container) {
        // ESCALADO PIXEL PERFECT PARA EL CONTENEDOR 2500X1080
        function scaleSlide4() {
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            
            // Calculamos la escala basada en 2500x1080 con un pequeño margen (0.9)
            const scale = Math.min(winW / 2500, winH / 1080) * 0.9;
            slide4Container.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        
        window.addEventListener('resize', scaleSlide4);
        scaleSlide4();

        // LÓGICA DE CABALLOS
        const horsesLayer = document.getElementById('horses-layer');
        const trackPathStr = "M 250,650 L 550,650 A 180 180 0 0 0 550,290 L 250,290 A 180 180 0 0 0 250,650";
        
        const trackPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        trackPath.setAttribute("d", trackPathStr);
        const pathLength = trackPath.getTotalLength();
        
        const horseData = [];
        const colors = ['#4a2c2a', '#6b4432', '#795548', '#8d6e63', '#a1887f', '#4e342e'];

        if (horsesLayer) {
            for (let i = 0; i < 6; i++) {
                const div = document.createElement('div');
                div.className = 'horse-unit';
                div.innerHTML = `<div class="horse-emoji is-galloping" style="color: ${colors[i]}">🐎</div>`;
                horsesLayer.appendChild(div);
                
                horseData.push({
                    el: div,
                    emoji: div.querySelector('.horse-emoji'),
                    progress: -(i * (pathLength * 0.015)),
                    speed: 1.0 + (Math.random() * 0.5) 
                });
            }

            function animateHorsesAndPackets() {
                horseData.forEach((h) => {
                    h.progress += h.speed;
                    if(h.progress > pathLength) h.progress -= pathLength; 

                    let visualProgress = h.progress < 0 ? 0 : h.progress;
                    let pt = trackPath.getPointAtLength(visualProgress);
                    
                    h.el.style.left = pt.x + 'px';
                    h.el.style.top = pt.y + 'px';

                    if (visualProgress >= 0 && visualProgress <= 300) h.emoji.style.transform = 'scaleX(-1)';
                    else if (visualProgress > 300 && visualProgress < 300 + (Math.PI*180)/2) h.emoji.style.transform = 'scaleX(-1)';
                    else if (visualProgress >= 300 + (Math.PI*180)/2 && visualProgress <= 600 + (Math.PI*180)/2) h.emoji.style.transform = 'scaleX(1)';
                    else h.emoji.style.transform = 'scaleX(1)';
                });

                requestAnimationFrame(animateHorsesAndPackets);
            }
            animateHorsesAndPackets();
        }

        // LÓGICA DE PARTÍCULAS DE RED (PAQUETES)
        const particlesLayer = document.getElementById('particles-layer');
        const deviceSources = document.querySelectorAll('.device-source');
        
        function dispatchPacket(sourceEl) {
            const slide = document.getElementById('slide-4-topologia');
            if (!slide || !slide.classList.contains('active')) return;

            const startX = parseFloat(sourceEl.style.left);
            const startY = parseFloat(sourceEl.style.top);
            const vlanColor = sourceEl.getAttribute('data-vlan');
            
            const p1 = document.createElement('div');
            p1.className = 'data-packet';
            p1.style.backgroundColor = vlanColor;
            p1.style.color = vlanColor;
            p1.style.left = startX + 'px';
            p1.style.top = startY + 'px';
            if (particlesLayer) particlesLayer.appendChild(p1);

            const anim1 = p1.animate([
                { transform: 'translate(0,0)' },
                { transform: `translate(${950 - startX}px, ${540 - startY}px)` }
            ], { duration: 600, easing: 'ease-in' });

            anim1.onfinish = () => {
                p1.remove();
                
                const p2 = document.createElement('div');
                p2.className = 'data-packet';
                p2.style.backgroundColor = 'var(--vlan-core)';
                p2.style.color = 'var(--vlan-core)';
                p2.style.left = '1000px'; 
                p2.style.top = '540px';
                if (particlesLayer) particlesLayer.appendChild(p2);

                const anim2 = p2.animate([
                    { transform: 'translate(0,0)' },
                    { transform: `translate(350px, 80px)` } 
                ], { duration: 400, easing: 'ease-out' });

                anim2.onfinish = () => p2.remove();
            };
        }

        setInterval(() => {
            const slide = document.getElementById('slide-4-topologia');
            if (slide && slide.classList.contains('active')) {
                if (Math.random() > 0.3 && deviceSources.length > 0) {
                    const randomSrc = deviceSources[Math.floor(Math.random() * deviceSources.length)];
                    dispatchPacket(randomSrc);
                }
            }
        }, 800); 
    }
});