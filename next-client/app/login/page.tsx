'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Building2, ShoppingCart, Home } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation de connexion
    setTimeout(() => setIsLoading(false), 2000);
    console.log("Login with", email, password);
    // TODO: Connecter à l'API Symfony
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-slate-900">
      {/* Background with Gradient Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[100px] mix-blend-screen" />
        <div className="absolute -bottom-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-center min-h-screen gap-12 lg:gap-24">

        {/* Left Side: Brand & Welcome */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left text-white space-y-6 max-w-xl"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-200">B2B Marketplace n°1 au Maroc</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            BOOPURSAL
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed font-light">
            La plateforme de référence pour les professionnels. Connectez acheteurs et fournisseurs avertis dans un environnement sécurisé et performant.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="p-2 bg-white/5 rounded-lg"><Building2 size={18} /></div>
              <span>Fournisseurs qualifiés</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="p-2 bg-white/5 rounded-lg"><ShoppingCart size={18} /></div>
              <span>Processus d'achat simplifié</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative">
              <h2 className="text-2xl font-semibold text-white mb-2">Bienvenue</h2>
              <p className="text-slate-400 mb-8">Connectez-vous à votre espace membre</p>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-1">
                  <label className="text-sm text-slate-300 ml-1">Email professionnel</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      placeholder="nom@entreprise.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-slate-300 ml-1">Mot de passe</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="text-right">
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Mot de passe oublié ?</a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-center text-slate-400 text-sm mb-4">Pas encore de compte ?</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/register/fournisseur" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-300 text-xs font-medium text-center transition-all">
                    Devenir Fournisseur
                  </Link>
                  <Link href="/register/acheteur" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-300 text-xs font-medium text-center transition-all">
                    Devenir Acheteur
                  </Link>
                </div>
                <div className="mt-6 text-center">
                  <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
                    <Home size={16} />
                    Retour à l'accueil
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
