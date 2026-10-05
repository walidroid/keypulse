# KeyPulse - Entraînement et Précision au Clavier

KeyPulse est un entraîneur interactif de dactylographie et de précision au clavier :
- **Texte à venir estompé** : Le texte non encore saisi est atténué pour éviter les distractions visuelles.
- **Mots validés en noir gras** : Dès qu'un mot est correctement saisi, il passe en noir gras pour un retour visuel immédiat.
- **Mise en valeur du caractère actif** : La touche à frapper est surlignée d'une couleur vive avec curseur animé et symbole d'espace pour maximiser la précision.
- **Clavier virtuel de dactylographie** : Visualisation du clavier avec repères pour les 10 doigts et animation de frappe des touches.
- **Moteur audio mécanique (Web Audio API)** : Profils sonores d'interrupteurs mécaniques sans latence (frappe sourde, clic franc, linéaire fluide ou silencieux).
- **Modes variés** : Séries de mots, contre-la-montre, citations littéraires, code de programmation et travail des touches difficiles.

---

## 🚀 Génération du fichier exécutable Windows (.exe) avec GitHub Actions

Ce dépôt est préconfiguré avec un workflow GitHub Actions (`.github/workflows/build-exe.yml`) qui compile automatiquement un **programme d'installation (.exe)** et un **exécutable portable (.exe)** pour Windows.

### Comment l'utiliser :

1. **Publier votre code sur GitHub** :
   ```bash
   git init
   git add .
   git commit -m "Version française de KeyPulse avec build .exe"
   git branch -M main
   git remote add origin https://github.com/<votre-nom-utilisateur>/<votre-depot>.git
   git push -u origin main
   ```

2. **Déclenchement automatique de l'action GitHub** :
   - Chaque envoi (`push`) sur la branche `main` lance automatiquement le travail de compilation sur une machine Windows (`windows-latest`).
   - Vous pouvez également le lancer manuellement depuis l'onglet **Actions** de votre dépôt GitHub en cliquant sur **Run workflow**.

3. **Télécharger votre fichier .exe** :
   - Rendez-vous sur votre dépôt GitHub.
   - Cliquez sur l'onglet **Actions**.
   - Cliquez sur la dernière exécution du workflow.
   - Rendez-vous en bas de page dans la section **Artifacts** (Artéfacts).
   - Téléchargez l'archive **`KeyPulse-Windows-Executable`** (elle contient l'installeur `.exe` et la version portable sans installation).

4. **Créer une Release GitHub (Optionnel)** :
   - Si vous publiez une nouvelle Release avec un tag (ex: `v1.0.0`), l'action GitHub attachera automatiquement les fichiers `.exe` directement aux fichiers de téléchargement public de la Release.

---

## 💻 Développement local

### Lancer la version Web (navigateur)
```bash
npm install
npm run dev
```
Ouvrez `http://localhost:3000` dans votre navigateur.

### Compiler la version Web
```bash
npm run build
```

### Compiler le fichier .exe en local (sous Windows)
```bash
npm run electron:build
```
Les exécutables générés se trouveront dans le dossier `release/`.
