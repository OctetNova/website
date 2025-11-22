/*
==============================================================================
    Fichier : sw.js (Service Worker)
    Auteur : OctetNova — Lilian Martin
    Version : 8.3.6 (Correctif des chemins de cache)
    Date : 23/10/2025
    Description : Service Worker pour la mise en cache des ressources de base
                  de l'application web progressive (PWA).
==============================================================================
*/

const CACHE_NAME = 'octetnova-cache-v1';

// Liste des fichiers à mettre en cache.
// IMPORTANT : Tous les chemins doivent être corrects depuis la racine du site.
const urlsToCache = [
    // --- Racine ---
    '/',
    '/index.html',
    '/manifest.json',

    // --- CSS ---
    '/css/style.css',

    // --- JavaScript ---
    '/js/script.js',

    // --- Pages HTML ---
    '/html/a_propos.html',
    '/html/contact.html',
    '/html/jeux.html',
    '/html/spacesinking1.html',
    '/html/spacesinking2.html',

    // --- Langues ---
    '/lang/en.json',
    '/lang/fr.json',

    // --- Images & Icônes principales ---
    '/img/icon/ICON_bt.svg',
    '/img/icon/ICON_wt.svg',
    '/img/icon/icon_bw_16.png',
    '/img/icon/icon_wb_192.png',
    '/img/bg/space_bg_black.webp',
    '/img/bg/space_bg_white.webp',
    '/img/bg/space_bg_blue.webp',
    '/img/bg/space_bg_bw.webp',
    '/img/other/sps1_bg.png',
    '/img/other/sps2_bg.png'
];

// Étape 1 : Installation du Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installation...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Mise en cache des fichiers de l\'application...');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Échec de la mise en cache initiale.', error);
            })
    );
});

// Étape 2 : Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activation...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Nettoyage de l\'ancien cache :', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Étape 3 : Interception des requêtes réseau (stratégie "Cache d'abord")
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la ressource est dans le cache, on la retourne
                if (response) {
                    return response;
                }
                // Sinon, on fait une requête réseau
                return fetch(event.request);
            })
    );
});