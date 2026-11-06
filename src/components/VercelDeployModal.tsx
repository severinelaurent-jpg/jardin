import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Github, 
  FileCode,
  Flame,
  Globe
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const { plots, plants, tasks, harvests, journal } = useGarden();
  const [copiedVercelJson, setCopiedVercelJson] = useState(false);
  const [copiedCliCmd, setCopiedCliCmd] = useState(false);

  if (!isOpen) return null;

  const vercelJsonContent = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const copyVercelJson = () => {
    navigator.clipboard.writeText(vercelJsonContent);
    setCopiedVercelJson(true);
    setTimeout(() => setCopiedVercelJson(false), 2000);
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText('npm i -g vercel\nvercel');
    setCopiedCliCmd(true);
    setTimeout(() => setCopiedCliCmd(false), 2000);
  };

  // Export data as JSON download
  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      appName: 'Mon Jardinier',
      plots,
      plants,
      tasks,
      harvests,
      journal,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mon_jardin_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
              ▲
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                Publication sur Vercel
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Prêt au déploiement
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Déployez votre application Mon Jardinier avec Firebase en ligne sur Vercel en 3 étapes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: Vercel Configuration Ready */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center justify-between">
                  <span>Configuration Vercel (`vercel.json`) incluse</span>
                  <button
                    onClick={copyVercelJson}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    {copiedVercelJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedVercelJson ? 'Copié !' : 'Copier le fichier'}
                  </button>
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Le fichier <code className="bg-stone-200 px-1.5 py-0.5 rounded text-[11px] font-mono">vercel.json</code> a déjà été configuré à la racine du projet avec les règles de réécriture SPA pour React et Vite.
                </p>
                <pre className="mt-2 text-[11px] bg-stone-900 text-stone-100 p-3 rounded-xl overflow-x-auto font-mono">
                  {vercelJsonContent}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 2: Deployment via Git & Vercel Dashboard */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Github className="w-4 h-4 text-stone-800" />
                  Méthode 1 : Déploiement automatique via GitHub (Recommandé)
                </h3>
                <ol className="mt-2 text-xs text-stone-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Publiez ce dossier de code sur votre compte <strong>GitHub</strong> ou GitLab.</li>
                  <li>Rendez-vous sur <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline inline-flex items-center gap-0.5">vercel.com/new <ExternalLink className="w-3 h-3" /></a>.</li>
                  <li>Sélectionnez votre dépôt GitHub. Vercel détecte automatiquement le framework <strong>Vite</strong>.</li>
                  <li>Cliquez sur <strong>Deploy</strong> : en 30 secondes, votre site de suivi de jardin est en ligne avec un lien HTTPS personnalisé (ex: <code>mon-jardinier.vercel.app</code>) !</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 3: Deployment via Vercel CLI */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center justify-between">
                  <span>Méthode 2 : Déploiement direct en 1 ligne (Vercel CLI)</span>
                  <button
                    onClick={copyCliCommand}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    {copiedCliCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCliCmd ? 'Copié !' : 'Copier'}
                  </button>
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Ouvrez un terminal dans le dossier et lancez :
                </p>
                <div className="mt-2 bg-stone-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                  <code>npx vercel --prod</code>
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Persistence Status Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Synchronisation des données Firebase</h4>
                <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                  Le fichier de configuration <code className="bg-amber-100 px-1 rounded font-mono">firebase-applet-config.json</code> est inclus dans le projet et les règles <code className="bg-amber-100 px-1 rounded font-mono">firestore.rules</code> ont été déployées sur votre base Cloud Firestore. Vos données seront automatiquement conservées et accessibles sur Vercel !
                </p>
              </div>
            </div>
          </div>

          {/* Export Data Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
            <button
              onClick={handleExportData}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Exporter une sauvegarde de mon jardin (JSON)
            </button>

            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-stone-800 text-xs font-bold shadow-md transition"
            >
              <Globe className="w-4 h-4" />
              Ouvrir Vercel Dashboard
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
