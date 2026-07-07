/**
 * cafe apart - Main Script (Advanced Features Version + Google Sheets DB)
 */

const SPREADSHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3obFx_eeJzUPLGj1btfJrzDKeo4tq9XUJcnB3yKRqMsxK1uw3z4_o4m7fMVkQbg2iFf3BD_EtBoic/pub?output=csv";

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================
       1. Splash Screen Loader
       ========================================= */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        // 同一セッション内の再訪ではスプラッシュの待ち時間を省略する
        let splashDelay = 1200;
        try {
            if (sessionStorage.getItem('splashShown')) splashDelay = 0;
            sessionStorage.setItem('splashShown', '1');
        } catch (e) { /* プライベートモード等でsessionStorage不可でも表示は継続 */ }

        setTimeout(() => {
            loader.classList.add('hidden');
            const heroInner = document.querySelector('.hero-inner');
            if (heroInner) heroInner.classList.add('visible');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, splashDelay);
    });

    /* =========================================
       1.5 Hero Slideshow Logic
       ========================================= */
    const initHeroSlider = () => {
        if (prefersReducedMotion) return;
        const slides = document.querySelectorAll('.hero-slideshow .slide');
        if (slides.length <= 1) return;

        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 6000); // Change image every 6 seconds
    };
    initHeroSlider();

    /* =========================================
       2. Custom Cursor
       ========================================= */
    const cursor = document.getElementById('cursor');
    if (!isTouchDevice && !prefersReducedMotion && cursor) {
        document.body.classList.add('custom-cursor-active');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Use event delegation for cursor hover to handle dynamic elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) {
                cursor.classList.add('hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) {
                cursor.classList.remove('hover');
            }
        });
    }

    /* =========================================
       4. Scroll Progress Bar & Header 
       ========================================= */
    const header = document.getElementById('header');
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if(progressBar) progressBar.style.width = progress + '%';

        // Back to Top Visibility
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =========================================
       5. Menu Filtering
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            // Query dynamic items dynamically instead of caching them outside
            const menuItems = document.querySelectorAll('.menu-item');

            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || 
                    filterValue === category || 
                    category === 'limited' || 
                    (filterValue === 'drink' && category === 't2')) {
                    item.classList.remove('hide');
                    item.style.animation = 'none';
                    item.offsetHeight; 
                    item.style.animation = null;
                } else {
                    item.classList.add('hide');
                }
            });

            // Update group titles visibility
            document.querySelectorAll('.menu-group').forEach(group => {
                const visibleItems = group.querySelectorAll('.menu-item:not(.hide)');
                const title = group.querySelector('.menu-section-title');
                if (title) {
                    if (visibleItems.length === 0) {
                        title.style.display = 'none';
                    } else {
                        title.style.display = 'block';
                    }
                }
            });
        });
    });

    /* =========================================
       6. Scroll Fade Animations
       ========================================= */
    const fadeElements = document.querySelectorAll('.content-fade');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    if (!prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const parallaxImg = document.querySelector('.parallax-slow');
            if(parallaxImg && scrolled < 2000) {
                parallaxImg.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        });
    }

    /* =========================================
       7. Mobile Menu Toggle
       ========================================= */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    document.getElementById('year').textContent = new Date().getFullYear();

    /* =========================================
       8. Weather Widget Logic
       ========================================= */
    const weatherWidget = document.getElementById('weather-widget');
    const weatherIconEl = document.getElementById('weather-icon');
    const weatherTempEl = document.getElementById('weather-temp');

    if (weatherIconEl && weatherTempEl) {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=34.8155&longitude=135.5683&current_weather=true&timezone=Asia%2FTokyo')
            .then(res => res.json())
            .then(data => {
                const temp = Math.round(data.current_weather.temperature);
                const code = data.current_weather.weathercode;
                
                let icon = '☀️';
                if (code === 1 || code === 2 || code === 3) icon = '☁️';
                else if (code >= 45 && code <= 48) icon = '🌫️';
                else if (code >= 51 && code <= 67) icon = '🌧️';
                else if (code >= 71 && code <= 77) icon = '❄️';
                else if (code >= 80 && code <= 82) icon = '☔';
                else if (code >= 95) icon = '⛈️';
                
                weatherTempEl.textContent = temp;
                weatherIconEl.textContent = icon;

                // Visual Enhancement: Background Overlay based on weather
                const hero = document.querySelector('.hero');
                if (hero) {
                    const overlay = document.createElement('div');
                    overlay.className = 'weather-overlay';
                    if (code === 0) overlay.classList.add('weather-clear');
                    else if (code >= 1 && code <= 3) overlay.classList.add('weather-cloudy');
                    else if (code >= 51) overlay.classList.add('weather-rainy');
                    hero.appendChild(overlay);
                }
                // Click to see recommendation
                weatherWidget.style.cursor = 'pointer';
                weatherWidget.title = 'Click for recommendation';
                
                weatherWidget.addEventListener('click', () => {
                    // Mood Shift: Briefly change site vibe
                    const root = document.documentElement;
                    const originalPrimary = getComputedStyle(root).getPropertyValue('--primary-color');
                    
                    if (code >= 51) {
                        // RAIN EFFECT
                        root.style.setProperty('--primary-color', '#3498db');
                        const container = document.createElement('div');
                        container.className = 'rain-container';
                        for (let i = 0; i < 50; i++) {
                            const drop = document.createElement('div');
                            drop.className = 'rain-drop';
                            drop.style.left = Math.random() * 100 + 'vw';
                            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                            drop.style.animationDelay = Math.random() * 2 + 's';
                            container.appendChild(drop);
                        }
                        document.body.appendChild(container);
                        setTimeout(() => container.remove(), 5000);
                    } else if (code === 0) {
                        // SUNNY EFFECT
                        root.style.setProperty('--primary-color', '#e67e22');
                        const container = document.createElement('div');
                        container.className = 'sun-container';
                        const sun = document.createElement('div');
                        sun.className = 'sunbeam';
                        container.appendChild(sun);
                        document.body.appendChild(container);
                        setTimeout(() => container.remove(), 5000);
                    }
                    
                    // Interaction Feedback (Pulse)
                    weatherWidget.style.transform = 'scale(0.9) rotate(-3deg)';
                    setTimeout(() => weatherWidget.style.transform = '', 150);
                    
                    setTimeout(() => {
                        root.style.setProperty('--primary-color', originalPrimary);
                    }, 5000);
                });
            })
            .catch(err => {
                console.error("Failed to load weather data", err);
                if(weatherWidget) weatherWidget.style.display = 'none';
            });
    }

    // Add float animation for tip
    const styleTip = document.createElement('style');
    styleTip.textContent = `
        @keyframes floatUp {
            from { opacity: 0; transform: translateX(-50%) translateY(10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(styleTip);

    /* =========================================
       9. Image Lightbox (Setup UI)
       ========================================= */
    const style = document.createElement('style');
    style.textContent = `
        .lightbox-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
            backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        }
        .lightbox-overlay.active { opacity: 1; pointer-events: all; }
        .lightbox-overlay img {
            max-width: 90vw; max-height: 85vh; border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: scale(0.95);
            transition: transform 0.3s ease; object-fit: contain;
        }
        .lightbox-overlay.active img { transform: scale(1); }
        .lightbox-close {
            position: absolute; top: 20px; right: 30px; color: #fff;
            font-size: 50px; cursor: pointer; font-weight: 200; line-height: 1;
        }
        .img-wrapper img, .gallery-img { cursor: zoom-in; }
    `;
    document.head.appendChild(style);

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `<div class="lightbox-close">&times;</div><img src="" alt="Popup">`;
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector('img');

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    /* =========================================
       10. Google Sheets DB & Dynamic Menu Rendering
       ========================================= */
    const menuContainer = document.getElementById('menu-container');

    // スプレッドシートの値をHTMLとして流し込む前にエスケープする（<br>のみ改行用に許可）
    function sanitize(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/&lt;br\s*\/?&gt;/gi, '<br>');
    }

    async function loadMenu() {
        if (!menuContainer) return;

        // Show Loading state
        menuContainer.innerHTML = '<div class="menu-loading">Now Loading... ☕️</div>';

        try {
            const res = await fetch(SPREADSHEET_CSV_URL);
            const csvText = await res.text();

            const lines = csvText.split('\n').filter(line => line.trim().length > 0);
            const data = [];

            for(let i=1; i < lines.length; i++) {
                // Regex for correctly splitting CSV containing quoted commas like "¥1,000"
                const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => sanitize(v.replace(/^"|"$/g, '').trim()));
                if(row.length >= 5 && row[2]) {
                    data.push({
                        category: row[0],
                        img: row[1] || "",
                        title: row[2] || "",
                        desc: row[3] || "",
                        price: row[4] || "",
                        note: row[5] || "",
                        memo: row[6] || ""
                    });
                }
            }

            renderMenuItems(data);

        } catch (err) {
            console.error("Failed to load DB", err);
            menuContainer.innerHTML = '<div class="menu-error">Failed to load menu data. Please try again later.</div>';
        }
    }

    function formatPrice(price) {
        if (!price) return '';
        return price.toString().replace(/\d{4,}/g, m => parseInt(m).toLocaleString());
    }

    function renderMenuItems(data) {
        menuContainer.innerHTML = ''; 

        const limitedItems = data.filter(item => (item.category || '').toLowerCase() === 'limited' || (item.note && item.note.includes('期間限定')));
        const t2ItemsRaw = data.filter(item => {
            const isLimited = (item.category || '').toLowerCase() === 'limited' || (item.note && item.note.includes('期間限定'));
            const isT2 = (item.category || '').toLowerCase() === 't2';
            return !isLimited && isT2;
        });
        
        let t2Items = [];
        if (t2ItemsRaw.length > 0) {
            const cupPotItems = t2ItemsRaw.filter(t => (t.price || '').includes('Cup') || (t.price || '').includes('Pot'));
            const specialItems = t2ItemsRaw.filter(t => !((t.price || '').includes('Cup') || (t.price || '').includes('Pot')));

            // Find most common price among Cup/Pot items
            let commonPrice = '';
            if (cupPotItems.length > 0) {
                const priceCounts = {};
                cupPotItems.forEach(t => priceCounts[t.price] = (priceCounts[t.price] || 0) + 1);
                let maxCount = 0;
                for (const p in priceCounts) {
                    if (priceCounts[p] > maxCount) { maxCount = priceCounts[p]; commonPrice = formatPrice(p); }
                }
            }

            let combinedHtml = '<div class="menu-combined">';

            // 1. Render Tea Group Header
            if (cupPotItems.length > 0) {
                combinedHtml += `<div class="menu-combined-header">
                                    <span class="menu-combined-label">Tea Selection</span>
                                    <span class="menu-combined-price">${commonPrice}</span>
                                 </div>`;
            }

            // 2. Render Cup/Pot Group Items
            cupPotItems.forEach((t, i) => {
                const isLast = (i === cupPotItems.length - 1 && specialItems.length === 0) ? ' is-last' : '';
                const thumbHtml = t.img ? `<div class="clickable-thumb" data-lightbox-src="${t.img}"><img src="${t.img}" alt="${t.title}" loading="lazy"></div>` : '';
                const displayPrice = (formatPrice(t.price) !== commonPrice) ? `<strong class="menu-combined-item-price">${formatPrice(t.price)}</strong>` : '';
                combinedHtml += `<div class="menu-combined-row${isLast}">${thumbHtml}<div class="menu-combined-body"><div class="menu-combined-titleline"><strong class="menu-combined-title">${t.title}</strong>${displayPrice}</div><span class="menu-combined-note">${t.note}</span></div></div>`;
            });

            // 3. Separator if both groups exist
            if (cupPotItems.length > 0 && specialItems.length > 0) {
                combinedHtml += '<div class="menu-combined-separator"><span>Others</span></div>';
            }

            // 4. Render Special Items
            specialItems.forEach((t, i) => {
                const isLast = (i === specialItems.length - 1) ? ' is-last' : '';
                const thumbHtml = t.img ? `<div class="clickable-thumb" data-lightbox-src="${t.img}"><img src="${t.img}" alt="${t.title}" loading="lazy"></div>` : '';
                combinedHtml += `<div class="menu-combined-row${isLast}">${thumbHtml}<div class="menu-combined-body"><div class="menu-combined-titleline"><strong class="menu-combined-title">${t.title}</strong><strong class="menu-combined-item-price">${formatPrice(t.price)}</strong></div><span class="menu-combined-note">${t.note}</span></div></div>`;
            });

            combinedHtml += '</div>';

            t2Items = [{
                category: 't2',
                img: 'assets/images/tea-set-top-view.jpg',
                title: 'T2 Tea Collection',
                desc: 'オーストラリア・メルボルン発の人気紅茶。<br>香り豊かなブレンドをお楽しみください。',
                price: '',
                note: combinedHtml
            }];
        }

        const kidsItemsRaw = data.filter(item => {
            const isLimited = (item.category || '').toLowerCase() === 'limited' || (item.note && item.note.includes('期間限定'));
            return !isLimited && (item.category || '').toLowerCase() === 'kids';
        });
        
        let kidsItems = [];
        if (kidsItemsRaw.length > 0) {
            // Find most common price
            const priceCounts = {};
            kidsItemsRaw.forEach(t => priceCounts[t.price] = (priceCounts[t.price] || 0) + 1);
            let commonPrice = '';
            let maxCount = 0;
            for (const p in priceCounts) {
                if (priceCounts[p] > maxCount) { maxCount = priceCounts[p]; commonPrice = formatPrice(p); }
            }

            let combinedHtml = '<div class="menu-combined">';

            // 1. Kids Group Header
            combinedHtml += `<div class="menu-combined-header">
                                <span class="menu-combined-label">Kids Selection</span>
                                <span class="menu-combined-price">${commonPrice}</span>
                             </div>`;

            // 2. Render Items
            kidsItemsRaw.forEach((t, i) => {
                const isLast = (i === kidsItemsRaw.length - 1) ? ' is-last' : '';
                const thumbHtml = t.img ? `<div class="clickable-thumb" data-lightbox-src="${t.img}"><img src="${t.img}" alt="${t.title}" loading="lazy"></div>` : '';

                // Only show price if it differs from commonPrice
                const displayPrice = (formatPrice(t.price) !== commonPrice) ? `<strong class="menu-combined-item-price">${formatPrice(t.price)}</strong>` : '';

                combinedHtml += `<div class="menu-combined-row${isLast}">${thumbHtml}<div class="menu-combined-body"><div class="menu-combined-titleline"><strong class="menu-combined-title">${t.title}</strong>${displayPrice}</div><span class="menu-combined-note">${t.note}</span></div></div>`;
            });

            // Allergy notice at the bottom
            combinedHtml += '<div class="menu-allergy-note"><span class="menu-allergy-title">Rice Flour & Allergy-Friendly</span><span class="menu-allergy-desc">米粉を使用したアレルギー配慮メニューです</span></div>';

            combinedHtml += '</div>';

            kidsItems = [{
                category: 'kids',
                img: 'assets/images/menu-kids-dessert.jpg',
                title: 'Kids Drink Service',
                desc: 'お子様にはキッズドリンク付き',
                price: '',
                note: combinedHtml
            }];
        }
        
        const otherItems = data.filter(item => {
            const isLimited = (item.category || '').toLowerCase() === 'limited' || (item.note && item.note.includes('期間限定'));
            const isT2 = (item.category || '').toLowerCase() === 't2';
            const isKids = (item.category || '').toLowerCase() === 'kids';
            return !isLimited && !isT2 && !isKids;
        });

        function renderGroup(title, items, groupId) {
            if (items.length === 0) return;
            
            let html = `<div class="menu-group" id="group-${groupId}">`;
            if (title) {
                const parts = title.split(' / ');
                const mainTitle = parts[0].trim();
                const subTitle = parts[1] ? `<div class="menu-section-subtitle">— ${parts[1].trim()} —</div>` : '';

                html += `<div class="menu-section-title content-fade">
                            <h2>
                                ${mainTitle}
                                ${subTitle}
                            </h2>
                        </div>`;
            }
            
            items.forEach((item, index) => {
                let imageSrc = item.img;
                if (imageSrc && imageSrc.includes('creamy-salmon.jpg')) {
                    imageSrc = imageSrc.replace('creamy-salmon.jpg', 'salmon-cream-udon.jpg');
                }

                const imageBlock = imageSrc 
                    ? `<div class="img-wrapper"><img src="${imageSrc}" ${item.lightboxSrc ? `data-lightbox-src="${item.lightboxSrc}"` : ''} alt="${item.title}" loading="lazy"></div>` 
                    : '';

                const noteBlock = item.note
                    ? `<div class="menu-note">${item.note}</div>`
                    : '';

                const extraClass = (groupId === 't2' || groupId === 'kids' || groupId === 'limited') ? ' span-2' : '';

                html += `
                    <div class="menu-item${extraClass}" data-category="${item.category}" style="--delay: ${index + 1}">
                        ${imageBlock}
                        <div class="menu-info">
                            ${item.category === 't2' || item.category === 'kids'
                                ? `<div class="menu-item-centered">
                                     <h4>${item.title}</h4>
                                     <p>${item.desc}</p>
                                   </div>`
                                : `<h4>${item.title}</h4>
                                   <p class="menu-item-desc">${item.desc}</p>`
                            }
                            ${noteBlock}
                            ${(!['t2', 'kids'].includes(item.category))
                                ? `<p class="price">${formatPrice(item.price)}</p>`
                                : ''
                            }
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
            
            if (groupId === 'limited') {
                const filtersEl = document.querySelector('.menu-filters');
                if (filtersEl) {
                    const limitedGrid = document.createElement('div');
                    limitedGrid.className = 'menu-grid';
                    limitedGrid.style.marginBottom = '40px';
                    limitedGrid.innerHTML = html;
                    filtersEl.parentNode.insertBefore(limitedGrid, filtersEl);
                    return;
                }
            }
            menuContainer.insertAdjacentHTML('beforeend', html);
        }

        const standardDrinkItems = otherItems.filter(item => (item.category || '').toLowerCase() === 'drink');
        const standardFoodItems = otherItems.filter(item => (item.category || '').toLowerCase() === 'food');
        const standardSweetsItems = otherItems.filter(item => (item.category || '').toLowerCase() === 'sweets');
        const standardMiscItems = otherItems.filter(item => !['drink', 'food', 'sweets'].includes((item.category || '').toLowerCase()));

        renderGroup('Limited Time / 期間限定', limitedItems, 'limited');
        renderGroup('T2 Tea Collection', t2Items, 't2');
        renderGroup('Drink', standardDrinkItems, 'drink-group');
        renderGroup('Food', standardFoodItems, 'food-group');
        renderGroup('Sweets', standardSweetsItems, 'sweets-group');
        renderGroup('Others', standardMiscItems, 'misc-group');
        renderGroup('Kids Selection', kidsItems, 'kids');

        attachDynamicEvents();
        adjustMenuLogos();

        // Trigger IntersectionObserver for new fade elements
        if (typeof observer !== 'undefined') {
            const fadeElements = document.querySelectorAll('.menu-section-title.content-fade:not(.visible)');
            fadeElements.forEach(el => observer.observe(el));
        }
    }

    function attachDynamicEvents() {
        // Attach Lightbox logic to new images and thumbnails
        const triggers = document.querySelectorAll('.img-wrapper img, .clickable-thumb, .gallery-img, .anniversary-photos img');
        triggers.forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const src = el.getAttribute('data-lightbox-src') || el.src;
                if (src) {
                    lightboxImg.src = src;
                    lightbox.classList.add('active');
                }
            });
        });
    }

    // Trigger the fetch!
    loadMenu();

    /* =========================================
       11. Dynamic Menu Logo Sizing
       ========================================= */
    function adjustMenuLogos() {
        const items = Array.from(document.querySelectorAll('.menu-item'));
        
        // 1. Reset all
        items.forEach(item => item.classList.remove('show-logo'));

        // 2. Group items by their vertical position (rows)
        const rows = {};
        items.forEach(item => {
            if (item.offsetParent === null) return; // Hidden elements
            const top = Math.round(item.getBoundingClientRect().top);
            if (!rows[top]) rows[top] = [];
            rows[top].push(item);
        });

        // 3. Process each row
        Object.values(rows).forEach(rowItems => {
            // Check if this row contains any REAL image
            const rowHasImage = rowItems.some(item => {
                const imgWrap = item.querySelector('.img-wrapper');
                return imgWrap && imgWrap.querySelector('img');
            });

            // If the row has at least one image, enable logos for the others if they are stretched
            if (rowHasImage) {
                rowItems.forEach(item => {
                    const imgWrap = item.querySelector('.img-wrapper');
                    if (imgWrap && imgWrap.querySelector('img')) return; // Already has image
                    
                    const info = item.querySelector('.menu-info');
                    if (!info) return;

                    const gap = item.getBoundingClientRect().height - info.getBoundingClientRect().height;
                    if (gap > 60) {
                        item.classList.add('show-logo');
                    }
                });
            }
        });
    }

    const menuObserver = new ResizeObserver(() => {
        adjustMenuLogos();
    });

    // We start observing the menu container once it exists
    const menuContainerEl = document.getElementById('menu-container');
    if (menuContainerEl) {
        menuObserver.observe(menuContainerEl);
        // Also observe individual items as they are added? 
        // Better: periodic check or after renderMenuItems
    }

    /* =========================================
       12. Infinite Scroll Marquee with Manual Interaction
       ========================================= */
    const initMarqueeScroll = () => {
        if (prefersReducedMotion) return; // 自動スクロールは無効化（手動スクロールは可能）
        const marquee = document.querySelector('.marquee');
        const content = marquee?.querySelector('.marquee-content');
        if (!marquee || !content) return;

        let scrollSpeed = 1.0; // 自動スクロールの速さ
        let isInteracting = false;
        let animationId = null;

        const step = () => {
            if (!isInteracting) {
                marquee.scrollLeft += scrollSpeed;
                
                // 無限ループの判定（1つ目のコンテナ分進んだらリセット）
                if (marquee.scrollLeft >= content.offsetWidth) {
                    marquee.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(step);
        };

        // インタラクション（マウス、タッチ）の検知
        const stopAuto = () => { isInteracting = true; };
        const startAuto = () => { 
            isInteracting = false; 
            // 手動スクロール後も、現在の位置から無限ループを維持
            if (marquee.scrollLeft >= content.offsetWidth) {
                marquee.scrollLeft -= content.offsetWidth;
            } else if (marquee.scrollLeft <= 0) {
                marquee.scrollLeft += content.offsetWidth;
            }
        };

        marquee.addEventListener('mousedown', stopAuto);
        marquee.addEventListener('touchstart', stopAuto, { passive: true });
        window.addEventListener('mouseup', startAuto);
        window.addEventListener('touchend', startAuto);
        
        // ホイール操作時も一時停止
        marquee.addEventListener('wheel', () => {
            stopAuto();
            clearTimeout(marquee.wheelTimeout);
            marquee.wheelTimeout = setTimeout(startAuto, 1000);
        }, { passive: true });

        animationId = requestAnimationFrame(step);
    };

    initMarqueeScroll();
});
