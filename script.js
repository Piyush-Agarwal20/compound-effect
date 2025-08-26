class CompoundingVisualizer {
    constructor() {
        this.chart = null;
        this.particleSystem = null;
        this.animationFrame = null;
        this.currentValues = {
            principal: 10000,
            rate: 8,
            years: 20,
            compound: 12,
            monthlyContribution: 500
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeChart();
        this.initializeParticles();
        this.calculate();
        this.startAnimations();
    }

    setupEventListeners() {
        // Principal slider
        const principalSlider = document.getElementById('principal');
        const principalValue = document.getElementById('principal-value');
        principalSlider.addEventListener('input', (e) => {
            this.currentValues.principal = parseInt(e.target.value);
            principalValue.textContent = `$${this.formatNumber(this.currentValues.principal)}`;
            this.calculate();
            this.triggerSliderEffect(e.target);
        });

        // Interest rate slider
        const rateSlider = document.getElementById('rate');
        const rateValue = document.getElementById('rate-value');
        rateSlider.addEventListener('input', (e) => {
            this.currentValues.rate = parseFloat(e.target.value);
            rateValue.textContent = `${this.currentValues.rate}%`;
            this.calculate();
            this.triggerSliderEffect(e.target);
        });

        // Years slider
        const yearsSlider = document.getElementById('years');
        const yearsValue = document.getElementById('years-value');
        yearsSlider.addEventListener('input', (e) => {
            this.currentValues.years = parseInt(e.target.value);
            yearsValue.textContent = `${this.currentValues.years} years`;
            this.calculate();
            this.triggerSliderEffect(e.target);
        });

        // Compound frequency selector
        const compoundSelect = document.getElementById('compound');
        compoundSelect.addEventListener('change', (e) => {
            this.currentValues.compound = parseInt(e.target.value);
            this.calculate();
            this.triggerSelectEffect(e.target);
        });

        // Monthly contribution slider
        const contributionSlider = document.getElementById('monthlyContribution');
        const contributionValue = document.getElementById('contribution-value');
        contributionSlider.addEventListener('input', (e) => {
            this.currentValues.monthlyContribution = parseInt(e.target.value);
            contributionValue.textContent = `$${this.formatNumber(this.currentValues.monthlyContribution)}`;
            this.calculate();
            this.triggerSliderEffect(e.target);
        });

        // Stat card hover effects
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.triggerMoneyRain();
            });
        });
    }

    triggerSliderEffect(slider) {
        slider.classList.add('animate-pulse');
        setTimeout(() => slider.classList.remove('animate-pulse'), 300);
        
        // Haptic feedback simulation
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }

    triggerSelectEffect(select) {
        select.classList.add('animate-bounce');
        setTimeout(() => select.classList.remove('animate-bounce'), 500);
    }

    calculate() {
        const { principal, rate, years, compound, monthlyContribution } = this.currentValues;
        
        // Calculate compound interest with monthly contributions
        let balance = principal;
        const monthlyRate = (rate / 100) / 12;
        const totalMonths = years * 12;
        const data = [];
        
        // Calculate month by month
        for (let month = 0; month <= totalMonths; month++) {
            if (month > 0) {
                // Add monthly contribution
                balance += monthlyContribution;
                // Apply monthly compound interest
                balance *= (1 + monthlyRate);
            }
            
            if (month % 12 === 0) { // Record yearly values
                data.push({
                    year: month / 12,
                    amount: balance
                });
            }
        }

        const finalAmount = balance;
        const totalContributions = principal + (monthlyContribution * totalMonths);
        const interestEarned = finalAmount - totalContributions;
        
        // Update display with animations
        this.updateBigNumbers(finalAmount, totalContributions, interestEarned);
        this.updateChart(data);
        this.updateStatistics(finalAmount, totalContributions, interestEarned);
        this.updateProgressBar();
    }

    updateBigNumbers(finalAmount, totalContributions, interestEarned) {
        this.animateNumberChange('final-amount', finalAmount);
        this.animateNumberChange('total-contributions', totalContributions);
        this.animateNumberChange('interest-earned', interestEarned);
        
        // Trigger excitement effects for large numbers
        if (interestEarned > 1000000000) {
            this.triggerBillionaireEffect();
        } else if (interestEarned > 1000000) {
            this.triggerMillionaireEffect();
        }
    }

    animateNumberChange(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const currentValue = parseFloat(element.textContent.replace(/[$,]/g, '')) || 0;
        
        anime({
            targets: { value: currentValue },
            value: targetValue,
            duration: 1000,
            easing: 'easeOutExpo',
            update: (anim) => {
                const current = anim.animations[0].currentValue;
                element.textContent = `$${this.formatNumber(Math.round(current))}`;
            },
            complete: () => {
                element.classList.add('animate-bounce');
                setTimeout(() => element.classList.remove('animate-bounce'), 500);
            }
        });
    }

    updateChart(data) {
        if (!this.chart) return;

        this.chart.data.labels = data.map(d => `Year ${d.year}`);
        this.chart.data.datasets[0].data = data.map(d => d.amount);
        
        // Create gradient for dramatic effect
        const ctx = this.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 237, 78, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 237, 78, 0.1)');
        
        this.chart.data.datasets[0].backgroundColor = gradient;
        
        // Animate chart update
        this.chart.update('resize');
    }

    updateStatistics(finalAmount, totalContributions, interestEarned) {
        const { principal, rate, years, monthlyContribution } = this.currentValues;
        
        // Growth multiple
        const growthMultiple = finalAmount / totalContributions;
        this.animateStatChange('growth-multiple', `${growthMultiple.toFixed(1)}x`);
        
        // Average monthly growth
        const monthlyGrowth = interestEarned / (years * 12);
        this.animateStatChange('monthly-growth', `$${this.formatNumber(Math.round(monthlyGrowth))}`);
        
        // Compound advantage (vs simple interest)
        const simpleInterest = totalContributions * (1 + (rate / 100) * years);
        const compoundAdvantage = ((finalAmount - simpleInterest) / simpleInterest) * 100;
        this.animateStatChange('compound-power', `${Math.max(0, compoundAdvantage).toFixed(0)}%`);
        
        // Effective annual rate
        const effectiveRate = (Math.pow(finalAmount / totalContributions, 1/years) - 1) * 100;
        this.animateStatChange('effective-rate', `${effectiveRate.toFixed(1)}%`);
    }

    animateStatChange(elementId, newValue) {
        const element = document.getElementById(elementId);
        element.classList.add('animate-pulse');
        
        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('animate-pulse');
            element.classList.add('animate-bounce');
            setTimeout(() => element.classList.remove('animate-bounce'), 500);
        }, 150);
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        const currentYear = document.getElementById('current-year');
        
        progressFill.style.width = '100%';
        currentYear.textContent = `Year ${this.currentValues.years}`;
    }

    initializeChart() {
        const ctx = document.getElementById('compoundChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [],
                    borderColor: '#ffd700',
                    borderWidth: 4,
                    fill: true,
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    tension: 0.4,
                    pointBackgroundColor: '#ffd700',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    shadowColor: 'rgba(255, 215, 0, 0.5)',
                    shadowBlur: 10,
                    shadowOffsetY: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffd700',
                        bodyColor: '#ffffff',
                        borderColor: '#ffd700',
                        borderWidth: 1,
                        cornerRadius: 10,
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                return `$${this.formatNumber(Math.round(context.parsed.y))}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            callback: (value) => {
                                return `$${this.formatNumber(value)}`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                onHover: (event, elements) => {
                    if (elements.length > 0) {
                        this.createSparkles(event.native.clientX, event.native.clientY);
                    }
                }
            }
        });
    }

    initializeParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        this.particles = [];
        this.createBackgroundParticles();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    createBackgroundParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animateParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
            ctx.fill();
        });
    }

    triggerMillionaireEffect() {
        // Create explosion effect
        this.createExplosion();
        
        // Show achievement message
        this.showAchievement('🎉 MILLIONAIRE! 🎉');
        
        // Intense money rain
        for (let i = 0; i < 50; i++) {
            setTimeout(() => this.createMoneyParticle(), i * 50);
        }
    }

    triggerBillionaireEffect() {
        // Create massive explosion effect
        this.createMegaExplosion();
        
        // Show achievement message
        this.showAchievement('💎 BILLIONAIRE! 💎<br/>🚀 TO THE MOON! 🚀');
        
        // Extreme money rain
        for (let i = 0; i < 150; i++) {
            setTimeout(() => this.createMoneyParticle(), i * 30);
        }
        
        // Add fireworks
        this.createFireworks();
    }

    createExplosion() {
        const colors = ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                this.createSparkles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    colors[Math.floor(Math.random() * colors.length)]
                );
            }, i * 20);
        }
    }

    createMegaExplosion() {
        const colors = ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4', '#45b7d1', '#9b59b6', '#e74c3c', '#2ecc71'];
        
        // Much more intense explosion for billionaires
        for (let i = 0; i < 300; i++) {
            setTimeout(() => {
                this.createSparkles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    colors[Math.floor(Math.random() * colors.length)]
                );
            }, i * 10);
        }
        
        // Screen shake effect
        document.body.style.animation = 'shake 0.5s ease-in-out 3';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 1500);
    }

    createFireworks() {
        const fireworkPositions = [
            { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
            { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
            { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
            { x: window.innerWidth * 0.3, y: window.innerHeight * 0.5 },
            { x: window.innerWidth * 0.7, y: window.innerHeight * 0.5 }
        ];
        
        fireworkPositions.forEach((pos, index) => {
            setTimeout(() => {
                for (let i = 0; i < 20; i++) {
                    this.createFireworkBurst(pos.x, pos.y);
                }
            }, index * 500);
        });
    }

    createFireworkBurst(x, y) {
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#9b59b6', '#e74c3c', '#2ecc71', '#f39c12'];
        const burst = document.createElement('div');
        burst.style.position = 'fixed';
        burst.style.left = x + 'px';
        burst.style.top = y + 'px';
        burst.style.width = '8px';
        burst.style.height = '8px';
        burst.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        burst.style.borderRadius = '50%';
        burst.style.pointerEvents = 'none';
        burst.style.zIndex = '1000';
        burst.style.boxShadow = '0 0 15px currentColor';
        
        document.body.appendChild(burst);
        
        anime({
            targets: burst,
            scale: [0, 2, 0],
            opacity: [1, 1, 0],
            translateX: (Math.random() - 0.5) * 300,
            translateY: (Math.random() - 0.5) * 300,
            duration: 2000,
            easing: 'easeOutQuart',
            complete: () => {
                if (burst.parentNode) {
                    burst.parentNode.removeChild(burst);
                }
            }
        });
    }

    createSparkles(x, y, color = '#ffd700') {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.backgroundColor = color;
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.boxShadow = `0 0 10px ${color}`;
            
            document.body.appendChild(sparkle);
            
            anime({
                targets: sparkle,
                scale: [0, 1, 0],
                opacity: [1, 0],
                translateX: (Math.random() - 0.5) * 100,
                translateY: (Math.random() - 0.5) * 100,
                duration: 1000,
                easing: 'easeOutQuart',
                complete: () => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }
            });
        }
    }

    triggerMoneyRain() {
        const rainContainer = document.getElementById('money-rain');
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => this.createMoneyParticle(), i * 100);
        }
    }

    createMoneyParticle() {
        const symbols = ['💰', '💵', '💸', '🤑', '💳', '💎'];
        const particle = document.createElement('div');
        particle.className = 'money-particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.animationDelay = Math.random() * 1 + 's';
        
        document.getElementById('money-rain').appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 5000);
    }

    showAchievement(message) {
        const achievement = document.createElement('div');
        achievement.innerHTML = message;
        achievement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: 800;
            color: #ffd700;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            z-index: 1001;
            pointer-events: none;
            text-align: center;
        `;
        
        document.body.appendChild(achievement);
        
        anime({
            targets: achievement,
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1, 0],
            duration: 3000,
            easing: 'easeOutElastic(1, .6)',
            complete: () => {
                if (achievement.parentNode) {
                    achievement.parentNode.removeChild(achievement);
                }
            }
        });
    }

    startAnimations() {
        const animate = () => {
            this.animateParticles();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
}

// Sound Effects (Web Audio API)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initializeAudio();
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playSliderSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playCashSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new CompoundingVisualizer();
    const soundEffects = new SoundEffects();
    
    // Add sound effects to sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => {
            soundEffects.playSliderSound();
        });
    });
    
    // Add cash sound to big number updates
    const observer = new MutationObserver(() => {
        soundEffects.playCashSound();
    });
    
    document.querySelectorAll('.big-number').forEach(element => {
        observer.observe(element, { childList: true, characterData: true, subtree: true });
    });
    
    // Auto-demo mode (optional)
    let demoMode = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            demoMode = !demoMode;
            if (demoMode) {
                startDemo();
            }
        }
    });
    
    function startDemo() {
        if (!demoMode) return;
        
        const sliders = document.querySelectorAll('input[type="range"]');
        const randomSlider = sliders[Math.floor(Math.random() * sliders.length)];
        const currentValue = parseInt(randomSlider.value);
        const range = parseInt(randomSlider.max) - parseInt(randomSlider.min);
        const newValue = Math.min(parseInt(randomSlider.max), currentValue + Math.random() * (range * 0.2));
        
        randomSlider.value = newValue;
        randomSlider.dispatchEvent(new Event('input'));
        
        setTimeout(startDemo, 2000);
    }
});