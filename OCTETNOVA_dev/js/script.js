/* The above code is a JavaScript script that serves as the main script for a website. Here is a
summary of what the code does: */
/*
    Nom du fichier : script.js
    Description : Script principal gérant l'interactivité, l'injection dynamique (header/footer), l'internationalisation (i18n) et les animations du site.

    ====================================================================================
    L'intégralité des fichiers des ci-contre et suivants répertoires sont la propriété
    exclusive d'OctetNova. Toute copie, modification, diffusion ou reproduction,
    totale ou partielle, est strictement interdite sans l'accord écrit préalable
    d'OctetNova. Merci de respecter le travail des développeurs.
    =====================================================================================
    Ce projet est distribué sous licence Creative Commons Attribution - Non Commercial -
    No Derivatives 4.0 International (CC BY-NC-ND 4.0).
    Vous êtes autorisé à partager ce travail à condition de créditer l'auteur, sans
    utilisation commerciale et sans aucune modification.
    ====================================================================================
    Contact : contact@octetnova.fr
    Site officiel : https://www.octetnova.fr
    -------------------------------------------------------------------------------------
    © 2020 - 2025 OctetNova. Tous droits réservés.
    Licence : Propriétaire – Utilisation restreinte.
    -------------------------------------------------------------------------------------
    Auteur : OctetNova — Lilian Martin
    Version : 8.5.1
    Date : 20/11/2025
    ====================================================================================

    Pour modifier le code :

    - Demander et obtenir au préalable l'accord du-des propriétaire(s)/auteur(s) : OctetNova - Lilian MARTIN (contact: contact@octetnova.fr ET lilian.martin67@outlook.fr).
    - Lire et comprendre l'intégralité du code étudié ainsi que son fonctionnement.
    - Créer une copie (backup) intégrale du dossier parent principal original répertoriant l'intégralité des ressources utiles au bon fonctionnement du site avant toute modification.
    - Renommer votre copie sous la forme : "OctetNova_V*.. " (* représentant un nombre quelconque suivant le numéro de version).
    - Modifier les entêtes de l'intégralité des fichiers (html5, css3, js).
    - Commenter votre code.
    - Respecter l'intégrité du site.
    - L'usage de l'intelligence artificielle est autorisée.
    - Traduire chaque contenu rajouté à l'aide des propriétées de balise html "data-i18n" ainsi que les parties dédiées dans le fichier javascript (js).
    - Verifier les proprétés de style attribuées à chaque nouveau contenu dans le fichier css. L'utilisation de variables dependantes du thème selectionné par l'utilsateur est fortement recommendé.
    - Tester les differents paramètres (footer) ainsi que la responsivité du site. Vous pouvez utiliser l'extension "Responsive Viewer" (https://bit.ly/4hhZnxS).
*/

// =============================================================================
// CONFIGURATION GLOBALE ET INITIALISATION
// =============================================================================

'use strict';

// Variables globales
let currentTranslations = {};
let isScrolling = false;
let lenis;

/**
 * Détection du support WebP pour optimiser le chargement des images
 * Ajoute la classe 'webp' ou 'no-webp' à la racine du document
 */
(function() {
    const webP = new Image();
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    webP.onload = webP.onerror = function() {
        if (webP.height === 2) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    };
})();

// =============================================================================
// FONCTION PRINCIPALE - INITIALISATION DU SITE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initialise toutes les fonctionnalités du site dans l'ordre approprié
     */
    function initializeSite() {
        handlePageTransitions();
        initPreloader();
        loadHeader();
        loadFooter();
        initThemeAndFont();
        
        // Initialiser Lenis en PREMIER pour le scroll fluide
        initLenis();
        
        initGallery(); 
        initGameDescriptions(); // Nouvelle fonction pour le système "Lire plus"

        initI18n().then(() => {
            initContactForm();
            initMobileMenu();
            initFooterAccordion();
            initScrollDownIndicator();
            initBackToTopButton();
        });

        initScrollEffects();
        initHeaderScroll();
        initScrollAnimations();
        
        // Initialisation spécifique aux pages de jeux
        if (typeof initCarousel === "function") {
            initCarousel();
        }

        registerServiceWorker();
    }

    // =============================================================================
    // GESTION DU SCROLL FLUIDE (LENIS)
    // =============================================================================

    /**
     * Initialise le scroll fluide avec Lenis
     * Configuration personnalisable pour une expérience optimale
     */
    function initLenis() {
        // Destruction de l'instance existante si elle existe
        if (lenis) {
            lenis.destroy();
        }
        
        // =============================================
        // RÉGLAGES PERSONNALISABLES - MODIFIEZ CES VALEURS
        // =============================================
        
        // DURATION : Durée de l'animation de scroll (en secondes)
        // - Plus la valeur est basse, plus le scroll est rapide
        // - Plus la valeur est haute, plus le scroll est lent et fluide
        const SCROLL_DURATION = 1.6; // Essayez entre 1.2 (rapide) et 2.5 (très lent)
        
        // EASING : Courbe d'animation du scroll
        // - 'easeOutCubic' : Très smooth, décélération progressive (recommandé)
        // - 'easeOutExpo' : Encore plus smooth, décélération très progressive
        // - Custom : Votre propre fonction easing
        const SCROLL_EASING = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
        
        // WHEEL_MULTIPLIER : Sensibilité de la molette de souris
        // - Plus la valeur est basse, moins le scroll "avance" par tick de molette
        // - Plus la valeur est haute, plus le scroll est sensible
        const WHEEL_MULTIPLIER = 1.1; // Essayez entre 0.8 (peu sensible) et 1.5 (très sensible)
        
        // TOUCH_MULTIPLIER : Sensibilité du touch (mobile)
        const TOUCH_MULTIPLIER = 1.3;
        
        // SMOOTH_TOUCH : Activer le smooth scroll sur mobile
        // - true : Scroll fluide sur mobile (peut être moins réactif)
        // - false : Scroll natif sur mobile (plus réactif)
        const SMOOTH_TOUCH = false;
        
        // =============================================
        // FIN DES RÉGLAGES - NE PAS MODIFIER CI-DESSOUS
        // =============================================
        
        lenis = new Lenis({
            duration: SCROLL_DURATION,
            easing: SCROLL_EASING,
            smoothWheel: true,
            smoothTouch: SMOOTH_TOUCH,
            wheelMultiplier: WHEEL_MULTIPLIER,
            touchMultiplier: TOUCH_MULTIPLIER,
            infinite: false,
            gestureOrientation: 'vertical',
            normalizeWheel: true,
            syncTouch: false
        });

        // Fonction RAF avec gestion d'erreur
        function raf(time) {
            if (lenis) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
        }
        
        requestAnimationFrame(raf);

        // Gestionnaire pour les événements de roue
        window.addEventListener('wheel', (e) => {
            // Laisser passer les événements de défilement horizontal
            if (e.deltaX !== 0 || Math.abs(e.deltaY) < 5) {
                return;
            }
        }, { passive: true });

        // Désactiver Lenis temporairement pendant le drag de la scrollbar
        let isScrollbarDragging = false;
        let scrollbarDragTimeout = null;
        
        window.addEventListener('mousedown', (e) => {
            // Détecter si le clic est sur la scrollbar
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            const isScrollbar = e.clientX > document.documentElement.clientWidth - scrollbarWidth;
            
            if (isScrollbar && lenis) {
                isScrollbarDragging = true;
                lenis.stop();
                
                // Clear any existing timeout
                if (scrollbarDragTimeout) {
                    clearTimeout(scrollbarDragTimeout);
                }
            }
        });

        window.addEventListener('mousemove', (e) => {
            // Si on drag la scrollbar, maintenir Lenis désactivé
            if (isScrollbarDragging && lenis) {
                lenis.stop();
            }
        });

        window.addEventListener('mouseup', () => {
            if (isScrollbarDragging && lenis) {
                isScrollbarDragging = false;
                
                // Redémarrer Lenis après un court délai pour laisser le scroll natif finir
                scrollbarDragTimeout = setTimeout(() => {
                    lenis.start();
                }, 50);
            }
        });

        // Gestion des touches de défilement (Espace, Flèches, Page Up/Down)
        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.code)) {
                if (lenis) {
                    // Arrêter brièvement Lenis pour les touches de défilement
                    lenis.stop();
                    setTimeout(() => lenis.start(), 150);
                }
            }
        });

        // Optionnel : Logger les paramètres actuels (désactivez en production)
        console.log('Lenis configuré avec:', {
            duration: SCROLL_DURATION,
            easing: 'easeOutCubic',
            wheelMultiplier: WHEEL_MULTIPLIER,
            smoothTouch: SMOOTH_TOUCH
        });
    }

    // =============================================================================
    // INJECTION DYNAMIQUE DU HEADER ET FOOTER
    // =============================================================================

    /**
     * Charge et injecte dynamiquement le header avec gestion des pages courantes
     */
    function loadHeader() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const headerHTML = `
        <header>
            <nav id="main_nav" role="navigation" aria-label="Navigation principale">
                <div id="main_logo"><h1><a href="index.html">OctetNova <span id="main_logo_tm">™</span> </a></h1></div>
                <ul>
                    <li><a href="jeux.html" data-i18n="navGames" ${currentPage === 'jeux.html' ? 'class="current-page"' : ''}></a></li>
                    <li><a href="a_propos.html" data-i18n="navAbout" ${currentPage === 'a_propos.html' ? 'class="current-page"' : ''}></a></li>
                    <li><a href="contact.html" data-i18n="navContact" ${currentPage === 'contact.html' ? 'class="current-page"' : ''}></a></li>
                    <li><a href="index.html" class="icon-home ${currentPage === 'index.html' ? 'current-page' : ''}"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/></svg></a></li>
                </ul>
                <button class="burger-menu" data-i18n-aria-label="ariaLabelOpenMenu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
            </nav>
            <div class="mobile-nav-panel">
                <ul>
                    <li><a href="index.html" data-i18n="footerHomeFinal" ${currentPage === 'index.html' ? 'class="current-page"' : ''}></a></li>
                    <li><a href="jeux.html" data-i18n="navGames" ${currentPage === 'jeux.html' ? 'class="current-page"' : ''}></a></li>
                    <li><a href="a_propos.html" data-i18n="navAbout" ${currentPage === 'a_propos.html' ? 'class="current-page"' : ''}></a></li>
                    <li><a href="contact.html" data-i18n="navContact" ${currentPage === 'contact.html' ? 'class="current-page"' : ''}></a></li>
                </ul>
            </div>
        </header>`;
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    /**
     * Charge et injecte dynamiquement le footer avec gestion des pages courantes
     */
    function loadFooter() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const footerHTML = `
        <footer>
            <div class="footer-inner">
                <div class="footer-categories">
                    <div class="footer-column">
                        <h3 class="footer-toggle" data-i18n="footerPagesTitle"></h3>
                        <ul class="pages footer-links">
                            <li><a href="index.html" data-i18n="footerHomeFinal" ${currentPage === 'index.html' ? 'class="current-page"' : ''}></a></li>
                            <li><a href="jeux.html" data-i18n="footerGames" ${currentPage === 'jeux.html' ? 'class="current-page"' : ''}></a></li>
                            <li><a href="a_propos.html" data-i18n="footerAbout" ${currentPage === 'a_propos.html' ? 'class="current-page"' : ''}></a></li>
                            <li><a href="contact.html" data-i18n="footerContact" ${currentPage === 'contact.html' ? 'class="current-page"' : ''}></a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3 class="footer-toggle" data-i18n="footerResourcesTitle"></h3>
                        <ul class="pages footer-links">
                            <li><a href="#" download data-i18n="footerResourceLink1"></a></li>
                            <li><a href="#" download data-i18n="footerResourceLink2"></a></li>
                            <li><a href="#" download data-i18n="footerResourceLink3"></a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3 class="footer-toggle" data-i18n="footerSettingsTitle"></h3>
                        <div class="footer-links">
                            <div class="footer-select">
                                <label for="theme-select" data-i18n="footerThemeLabel"></label>
                                <select id="theme-select"><option value="dark" data-i18n="themeDark"></option><option value="light" data-i18n="themeLight"></option><option value="blue" data-i18n="themeBlue"></option><option value="bw" data-i18n="themeBW"></option></select>
                            </div>
                            <div class="footer-select">
                                <label for="font-select" data-i18n="footerFontLabel"></label>
                                <select id="font-select"><option value="roboto" data-i18n="fontRoboto"></option><option value="tech" data-i18n="fontTech"></option><option value="elegant" data-i18n="fontElegant"></option><option value="dyslexic1" data-i18n="fontDyslexic1"></option></option><option value="dyslexic2" data-i18n="fontDyslexic2"></option></select>
                            </div>
                            <div class="footer-select">
                                <label for="lang-select" data-i18n="footerLangLabel"></label>
                                <select id="lang-select"><option value="fr" data-i18n="langFR"></option><option value="en" data-i18n="langEN"></option></select>
                            </div>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h3 class="footer-toggle" data-i18n="footerContactNetworksTitle"></h3>
                        <div class="footer-contact footer-links">
                            <a href="https://www.youtube.com/channel/UCz3s6-7RpLcHAiZvnpEskbA" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" role="img" aria-hidden="true"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.188-.01.911-.074 1.957l-.008.104-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.01 2.01 0 0 1-1.415 1.42c-1.16.308-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119 1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/></svg><span data-i18n="youtubeLink"></span></a>
                            <a href="mailto:contact@octetnova.fr" aria-label="Email"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" role="img" aria-hidden="true"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/></svg><span data-i18n="mailLink"></span></a>
                            <a href="https://discord.gg/sbPsES4VKV" aria-label="Discord" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" role="img" aria-hidden="true"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg><span data-i18n="discordLink"></span></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p class="Version">Version 8.5.1</p>
                    <p class="Copyright" data-i18n="copyrightText"></p>
                </div>
            </div>
                <button id="back-to-top-btn" aria-label="Retour en haut">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                </button>
        </footer>`;
        const contentDiv = document.querySelector('.content');
        if (contentDiv) {
            contentDiv.insertAdjacentHTML('afterend', footerHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', footerHTML);
        }
    }

    // =============================================================================
    // FONCTIONNALITÉS D'INTERFACE UTILISATEUR
    // =============================================================================

    /**
     * Initialise l'accordéon dans le footer pour mobile
     */
    function initFooterAccordion() {
        document.body.addEventListener('click', (e) => {
            const toggle = e.target.closest('.footer-toggle');
            if (!toggle) return;
            if (window.getComputedStyle(toggle).cursor !== 'pointer') return;
            const content = toggle.nextElementSibling;
            if (!content) return;
            toggle.classList.toggle('is-open');
            content.classList.toggle('is-open');
        });
    }

    /**
     * Initialise le menu burger pour mobile
     */
    function initMobileMenu() {
        const burgerMenu = document.querySelector('.burger-menu');
        const mobileNavPanel = document.querySelector('.mobile-nav-panel');
        if (!burgerMenu || !mobileNavPanel) return;
        burgerMenu.addEventListener('click', () => {
            const isOpen = burgerMenu.classList.toggle('is-open');
            mobileNavPanel.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', isOpen);
            burgerMenu.setAttribute('aria-label', isOpen ? (currentTranslations.ariaLabelCloseMenu || 'Fermer le menu') : (currentTranslations.ariaLabelOpenMenu || 'Ouvrir le menu'));
        });
    }

    /**
     * Initialise le système "Lire plus" pour les descriptions de jeux
     * Ajoute un bouton pour développer/réduire les textes longs
     */
    function initGameDescriptions() {
        const gameDescriptions = document.querySelectorAll('.jeux .game-item .game-description');
        
        gameDescriptions.forEach(description => {
            const content = description.querySelector('p');
            if (!content) return;
            
            const readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'read-more-btn';
            readMoreBtn.textContent = 'Lire plus';
            readMoreBtn.setAttribute('aria-label', 'Afficher plus de contenu');
            
            /**
             * Vérifie si le contenu dépasse la hauteur disponible
             * et affiche/masque le bouton "Lire plus" en conséquence
             */
            const checkContentHeight = () => {
                if (content.scrollHeight > description.clientHeight) {
                    if (!description.contains(readMoreBtn)) {
                        description.appendChild(readMoreBtn);
                    }
                } else {
                    if (readMoreBtn.parentNode === description) {
                        description.removeChild(readMoreBtn);
                    }
                }
            };
            
            // Vérifier au chargement et au redimensionnement
            checkContentHeight();
            window.addEventListener('resize', checkContentHeight);
            
            // Gérer le clic sur "Lire plus"
            readMoreBtn.addEventListener('click', function() {
                description.classList.toggle('expanded');
                readMoreBtn.textContent = description.classList.contains('expanded') ? 'Lire moins' : 'Lire plus';
            });
        });
    }

    // =============================================================================
    // TRANSITIONS ET ANIMATIONS
    // =============================================================================

    /**
     * Gère les transitions fluides entre les pages
     */
    function handlePageTransitions() {
        const FADE_DURATION = 500;
        const transitionOverlay = document.getElementById('page-transition-overlay');
        const gameHero = document.querySelector('.game-hero-carousel');

        window.addEventListener('load', () => {
            if (transitionOverlay) {
                transitionOverlay.classList.add('fade-out');

                if (gameHero) {
                    setTimeout(() => {
                        gameHero.classList.add('animate-in');
                    }, 50);
                }
            }
        });

        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            // Ignorer les liens qui ne nécessitent pas de transition
            if (!link || 
                link.target === '_blank' || 
                (link.protocol !== 'http:' && link.protocol !== 'https:') || 
                (link.hash && link.pathname === window.location.pathname) || 
                link.hasAttribute('download') ||
                link.classList.contains('glightbox')
            ) {
                return;
            }
            
            e.preventDefault();
            if (transitionOverlay) {
                transitionOverlay.classList.remove('fade-out');
                transitionOverlay.classList.add('fade-in');
            }
            setTimeout(() => {
                window.location.href = link.href;
            }, FADE_DURATION);
        });

        window.addEventListener('pageshow', (event) => {
            if (event.persisted && transitionOverlay) {
                transitionOverlay.classList.remove('fade-in');
                transitionOverlay.classList.add('fade-out');
            }
        });
    }

    /**
     * Initialise le préchargeur avec durée minimale et détection de rafraîchissement
     */
    function initPreloader() {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (!loaderWrapper) return;
        const navEntries = performance.getEntriesByType("navigation");
        const isRefresh = navEntries.length > 0 && navEntries[0].type === 'reload';
        const isFirstVisit = sessionStorage.getItem('initialLoaderCompleted') !== 'true';
        if (isRefresh || isFirstVisit) {
            const MIN_LOADING_TIME = 1800;
            const minimumTimeElapsed = new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));
            const pageLoaded = new Promise(resolve => window.addEventListener('load', resolve));
            Promise.all([minimumTimeElapsed, pageLoaded]).then(() => {
                loaderWrapper.classList.add('hidden');
                sessionStorage.setItem('initialLoaderCompleted', 'true');
            });
        } else {
            loaderWrapper.style.display = 'none';
        }
    }

    /**
     * Initialise les animations au scroll (Intersection Observer)
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
        if (!animatedElements.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => observer.observe(element));
    }

    /**
     * Initialise les effets de parallaxe et d'opacité au scroll
     */
    function initScrollEffects() {
        const elements = document.querySelectorAll('.scroll-effect');
        if (!elements.length) return;

        // Vérifier que Lenis est initialisé
        if (!lenis) {
            console.warn('Lenis non initialisé pour les effets de scroll');
            return;
        }

        // Utiliser l'événement scroll de Lenis
        lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            elements.forEach(el => {
                // Effet parallaxe basique
                const speed = el.dataset.speed || 0.3;
                el.style.transform = `translateY(${scroll * speed}px)`;
                
                // Effet d'opacité basé sur la progression
                const opacityStart = el.dataset.opacityStart || 0;
                const opacityEnd = el.dataset.opacityEnd || 1;
                const opacityProgress = Math.min(Math.max(progress, 0), 1);
                el.style.opacity = opacityStart + (opacityEnd - opacityStart) * opacityProgress;
            });
        });

        console.log('Effets de scroll initialisés sur', elements.length, 'éléments');
    }

    // =============================================================================
    // GESTION DU SCROLL ET NAVIGATION
    // =============================================================================

    /**
     * Cache le header au scroll vers le bas pour gagner de l'espace
     */
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let lastScroll = 0;
        let ticking = false;

        const updateHeader = () => {
            const scroll = window.scrollY;
            header.classList.toggle(
                'header-hidden',
                scroll > lastScroll && scroll > header.offsetHeight
            );
            lastScroll = scroll <= 0 ? 0 : scroll;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Initialise le bouton "Retour en haut" avec animation fluide
     */
    function initBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (!backToTopBtn) {
            console.warn('Bouton retour en haut non trouvé');
            return;
        }

        let isScrollingToTop = false;

        // Détection d'affichage avec scroll natif
        window.addEventListener('scroll', () => {
            if (isScrollingToTop) return; // Ne pas interférer pendant l'animation
            
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Empêcher les clics multiples
            if (isScrollingToTop) return;
            isScrollingToTop = true;

            // Désactiver temporairement Lenis pour éviter les conflits
            if (lenis) {
                lenis.stop();
            }

            const startPosition = window.scrollY;
            const duration = 1000; // Durée totale de l'animation
            const startTime = performance.now();

            // Fonction d'animation fluide
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function - easeOutCubic pour un effet smooth
                const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
                const easedProgress = easeOutCubic(progress);
                
                // Calcul de la position
                const newPosition = startPosition * (1 - easedProgress);
                window.scrollTo(0, newPosition);
                
                // Continuer l'animation ou terminer
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    // Animation terminée
                    isScrollingToTop = false;
                    
                    // Réactiver Lenis après un court délai
                    if (lenis) {
                        setTimeout(() => {
                            lenis.start();
                        }, 100);
                    }
                    
                    // Forcer le scroll en haut (sécurité)
                    window.scrollTo(0, 0);
                }
            };

            // Démarrer l'animation
            requestAnimationFrame(animateScroll);

            // Empêcher le comportement par défaut et la propagation
            e.stopPropagation();
        });

        // Empêcher la propagation des événements sur le bouton
        backToTopBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        
        backToTopBtn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });

        console.log('Bouton retour en haut initialisé');
    }

    /**
     * Initialise l'indicateur de défilement vers le bas
     */
    function initScrollDownIndicator() {
        const scrollDownBtn = document.getElementById('scroll-down-indicator');
        const targetSection = document.getElementById('startContent');
        const heroSection = document.querySelector('.hero');
        
        if (!scrollDownBtn || !targetSection || !heroSection) return;

        scrollDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (lenis) {
                lenis.stop();
            }

            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
                const run = startPosition + (distance * easeOutCubic(progress));
                
                window.scrollTo(0, run);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    if (lenis) {
                        setTimeout(() => lenis.start(), 100);
                    }
                }
            }

            requestAnimationFrame(animation);
        });

        window.addEventListener('scroll', () => {
            if (!scrollDownBtn) return;
            
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            
            if (scrollPosition > heroBottom - windowHeight / 2) {
                scrollDownBtn.style.opacity = '0';
                scrollDownBtn.style.pointerEvents = 'none';
                scrollDownBtn.style.visibility = 'hidden';
            } else {
                scrollDownBtn.style.opacity = '1';
                scrollDownBtn.style.pointerEvents = 'auto';
                scrollDownBtn.style.visibility = 'visible';
            }

            const documentHeight = document.documentElement.scrollHeight;
            if (scrollPosition + windowHeight >= documentHeight - 100) {
                scrollDownBtn.style.opacity = '0';
                scrollDownBtn.style.pointerEvents = 'none';
                scrollDownBtn.style.visibility = 'hidden';
            }
        }, { passive: true });

        scrollDownBtn.style.opacity = '1';
        scrollDownBtn.style.pointerEvents = 'auto';
        scrollDownBtn.style.visibility = 'visible';
    }

    // =============================================================================
    // INTERNATIONALISATION (I18N)
    // =============================================================================

    /**
     * Initialise le système d'internationalisation avec chargement asynchrone
     */
    async function initI18n() {
        const langSelect = document.getElementById('lang-select');
        if (!langSelect) return;
        
        /**
         * Charge les traductions depuis le fichier JSON correspondant à la langue
         * @param {string} lang - Code de langue (fr, en, etc.)
         * @returns {Promise<Object>} Objet contenant les traductions
         */
        const fetchTranslations = async (lang) => {
            try {
                const response = await fetch(`../lang/${lang}.json`);
                if (!response.ok) throw new Error(`Fichier de traduction introuvable pour : ${lang}`);
                return await response.json();
            } catch (error) {
                console.error('Erreur de chargement des traductions:', error);
                try {
                    const fallbackResponse = await fetch(`../lang/fr.json`);
                    return fallbackResponse.ok ? await fallbackResponse.json() : {};
                } catch (fallbackError) {
                    console.error('Erreur de chargement des traductions de secours:', fallbackError);
                    return {};
                }
            }
        };
        
        /**
         * Met à jour tout le contenu du site avec les traductions actuelles
         */
        const updateContent = () => {
            const i18nAttributes = { 
                'data-i18n': 'innerHTML', 
                'placeholder-i18n': 'placeholder', 
                'data-i18n-title': 'title', 
                'data-i18n-alt': 'alt', 
                'data-i18n-aria-label': 'aria-label' 
            };
            
            for (const [attr, prop] of Object.entries(i18nAttributes)) {
                document.querySelectorAll(`[${attr}]`).forEach(el => {
                    const key = el.getAttribute(attr);
                    const translation = currentTranslations[key];
                    if (translation !== undefined) {
                        if (prop === 'aria-label') {
                            el.setAttribute(prop, translation);
                        } else {
                            el[prop] = translation;
                        }
                    }
                });
            }
            
            const titleEl = document.querySelector('title[data-i18n]');
            if (titleEl) {
                const key = titleEl.getAttribute('data-i18n');
                if (currentTranslations[key] !== undefined) {
                    titleEl.textContent = currentTranslations[key];
                }
            }
        };
        
        /**
         * Change la langue du site et met à jour tous les contenus
         * @param {string} lang - Nouvelle langue à appliquer
         */
        const changeLanguage = async (lang) => {
            localStorage.setItem('userLang', lang);
            currentTranslations = await fetchTranslations(lang);
            updateContent();
            langSelect.value = lang;
            document.documentElement.lang = lang;
            
            updateGalleryButtonText();
            updateMobileMenuAriaLabels();
        };
        
        /**
         * Met à jour le texte du bouton de la galerie selon la langue
         */
        const updateGalleryButtonText = () => {
            const toggleBtn = document.getElementById('gallery-toggle-btn');
            if (toggleBtn) {
                const btnText = toggleBtn.querySelector('span');
                if (btnText) {
                    const galleryContainer = document.querySelector('.gallery-container');
                    const isExpanded = galleryContainer && galleryContainer.classList.contains('is-expanded');
                    btnText.textContent = isExpanded 
                        ? (currentTranslations.galleryShowLess || "Voir Moins") 
                        : (currentTranslations.galleryShowMore || "Voir Plus");
                }
            }
        };
        
        /**
         * Met à jour les labels ARIA du menu mobile selon la langue
         */
        const updateMobileMenuAriaLabels = () => {
            const burgerMenu = document.querySelector('.burger-menu');
            if (burgerMenu) {
                const isOpen = burgerMenu.classList.contains('is-open');
                burgerMenu.setAttribute('aria-label', 
                    isOpen 
                        ? (currentTranslations.ariaLabelCloseMenu || 'Fermer le menu') 
                        : (currentTranslations.ariaLabelOpenMenu || 'Ouvrir le menu')
                );
            }
        };
        
        // Déterminer la langue initiale
        const savedLang = localStorage.getItem('userLang') || navigator.language.split('-')[0];
        const initialLang = ['fr', 'en'].includes(savedLang) ? savedLang : 'fr';
        
        await changeLanguage(initialLang);
        
        // Écouter les changements de langue
        langSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }

    // =============================================================================
    // PERSONNALISATION (THÈMES ET POLICES)
    // =============================================================================

    /**
     * Initialise la gestion des thèmes et polices personnalisés
     */
    function initThemeAndFont() {
        const themeSelect = document.getElementById('theme-select');
        const fontSelect = document.getElementById('font-select');
        const body = document.body;
        const root = document.documentElement;
        if (!themeSelect || !fontSelect) return;
        
        /**
         * Applique une préférence utilisateur (thème ou police)
         * @param {string} key - Clé de stockage localStorage
         * @param {HTMLSelectElement} selectElement - Élément select correspondant
         * @param {string[]} classList - Liste des classes possibles
         * @param {string} defaultValue - Valeur par défaut
         */
        const applyPreference = (key, selectElement, classList, defaultValue) => {
            const savedValue = localStorage.getItem(key);
            const valueToApply = classList.includes(savedValue) ? savedValue : defaultValue;
            let newBodyClassName = body.className.split(' ').filter(c => !classList.includes(c)).join(' ');
            body.className = `${newBodyClassName} ${valueToApply}`.trim();
            
            if (key === 'userTheme') {
                const themes = ['dark', 'light', 'blue', 'bw'];
                let newRootClassName = root.className.split(' ').filter(c => !themes.includes(c)).join(' ');
                root.className = `${newRootClassName} ${valueToApply}`.trim();
            }
            
            selectElement.value = valueToApply;
        };
        
        const themes = ['dark', 'light', 'blue', 'bw'];
        const fonts = ['roboto', 'tech', 'elegant', 'dyslexic1', 'dyslexic2'];
        
        // Appliquer les préférences sauvegardées
        applyPreference('userTheme', themeSelect, themes, 'dark');
        applyPreference('userFont', fontSelect, fonts, 'roboto');
        
        // Écouter les changements de thème
        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            localStorage.setItem('userTheme', newTheme);
            applyPreference('userTheme', themeSelect, themes, newTheme);
        });
        
        // Écouter les changements de police
        fontSelect.addEventListener('change', (e) => {
            const newFont = e.target.value;
            localStorage.setItem('userFont', newFont);
            applyPreference('userFont', fontSelect, fonts, newFont);
        });
    }

    // =============================================================================
    // FONCTIONNALITÉS AVANCÉES
    // =============================================================================

    /**
     * Initialise la galerie d'images avec lightbox
     */
    function initGallery() {
        const toggleBtn = document.getElementById('gallery-toggle-btn');
        const galleryContainer = document.querySelector('.gallery-container');

        if (toggleBtn && galleryContainer) {
            const updateButtonText = () => {
                const btnText = toggleBtn.querySelector('span');
                if (!btnText) return;
                const isExpanded = galleryContainer.classList.contains('is-expanded');
                btnText.textContent = isExpanded 
                    ? (currentTranslations.galleryShowLess || "Voir Moins") 
                    : (currentTranslations.galleryShowMore || "Voir Plus");
            };
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                galleryContainer.classList.toggle('is-expanded');
                updateButtonText();
            });
            updateButtonText();
        }

        // Initialiser GLightbox si disponible
        if (typeof GLightbox !== 'undefined') {
            const lightbox = GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                zoomable: true,
                dragAutoSnap: true
            });
        }
    }

    /**
     * Initialise le formulaire de contact avec double envoi pour fiabilité
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        if (!form || !formStatus) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const accessKey1 = "1c16d9b4-9f40-4596-8a6e-546e79ca13e5";
            const accessKey2 = "d04e12a4-786c-4f75-9133-bbabd874440e";
            const formData = new FormData(form);
            const commonData = Object.fromEntries(formData);
            const subject = (currentTranslations.formEmailSubject || "Nouveau message de {name}").replace('{name}', commonData.name);
            const htmlMessage = `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2 style="color: #0080ff;">${currentTranslations.formEmailTitle || "Nouveau message reçu"}</h2><p>${currentTranslations.formEmailIntro || "Message reçu via le formulaire de contact."}</p><hr><p><strong>${currentTranslations.formNameLabel || "Nom"}:</strong> ${commonData.name}</p><p><strong>${currentTranslations.formEmailLabel || "Email"}:</strong> <a href="mailto:${commonData.email}">${commonData.email}</a></p><p><strong>${currentTranslations.formSubjectLabel || "Sujet"}:</strong> ${commonData.subject}</p><h3>Message :</h3><div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; border: 1px solid #ddd; color: #333;"><p style="margin: 0;">${commonData.message}</p></div><hr><p style="font-size: 0.9em; color: #777;">${currentTranslations.formEmailFooter || "Email envoyé depuis octetnova.fr"}</p></div>`;
            const data1 = { ...commonData, access_key: accessKey1, subject, html: htmlMessage };
            const data2 = { ...commonData, access_key: accessKey2, subject, html: htmlMessage };
            formStatus.style.display = 'block';
            formStatus.innerHTML = currentTranslations.formStatusSending || 'Envoi en cours...';
            formStatus.className = 'sending';
            const sendForm = data => fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) });
            Promise.all([sendForm(data1), sendForm(data2)]).then(async ([res1, res2]) => {
                if (res1.ok && res2.ok) {
                    formStatus.innerHTML = currentTranslations.formStatusSuccess || 'Message envoyé !';
                    formStatus.className = 'success';
                    form.reset();
                } else {
                    formStatus.innerHTML = currentTranslations.formStatusError || 'Une erreur est survenue.';
                    formStatus.className = 'error';
                }
            }).catch(() => {
                formStatus.innerHTML = currentTranslations.formStatusError || 'Une erreur est survenue.';
                formStatus.className = 'error';
            }).finally(() => {
                setTimeout(() => { formStatus.style.display = 'none'; }, 6000);
            });
        });
    }

    /**
     * Enregistre le Service Worker pour les fonctionnalités PWA
     */
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js')
                    .then(registration => console.log('Service Worker enregistré avec succès :', registration))
                    .catch(error => console.log('Échec de l\'enregistrement du Service Worker :', error));
            });
        }
    }

    // =============================================================================
    // LANCEMENT DE L'INITIALISATION
    // =============================================================================

    initializeSite();
});