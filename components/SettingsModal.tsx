import React, { useState, useRef, useEffect } from 'react';
import { X, User as UserIcon, Info, ExternalLink, Globe, ChevronDown, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { getAvatarUrl } from '../utils/avatar';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onNavigateToProfile?: (username: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, onToggleTheme, onNavigateToProfile }) => {
    const { user } = useAuth();
    const { t, language, setLanguage } = useI18n();
    const [showLangInfo, setShowLangInfo] = useState(false);
    const langInfoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showLangInfo) return;
        const handleClick = (e: MouseEvent) => {
            if (langInfoRef.current && !langInfoRef.current.contains(e.target as Node)) {
                setShowLangInfo(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showLangInfo]);

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/5">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('settings')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* User Profile Section */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden border border-zinc-200 dark:border-white/10">
                                <img src={getAvatarUrl(user.avatar_url, user.username)} alt={user.username} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">@{user.username}</h3>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                    {t('memberSince')} {new Date(user.createdAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        onClose();
                                        onNavigateToProfile?.(user.username);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                                >
                                    <ExternalLink size={16} />
                                    {t('viewProfile')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                            <UserIcon size={20} />
                            <h3 className="font-semibold">{t('account')}</h3>
                        </div>
                        <div className="pl-7 space-y-3">
                            <div>
                                <label className="text-sm text-zinc-500 dark:text-zinc-400">{t('username')}</label>
                                <p className="text-zinc-900 dark:text-white font-medium">@{user.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Language Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                            <Globe size={20} />
                            <h3 className="font-semibold">{t('language')}</h3>
                            <div className="relative" ref={langInfoRef}>
                                <button
                                    onClick={() => setShowLangInfo(!showLangInfo)}
                                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <Info size={14} />
                                </button>
                                {showLangInfo && (
                                    <div className="absolute left-0 top-8 z-10 w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-3">
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('localizedBy')}</p>
                                        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                            {t('originalLocalizationCredit')}
                                        </p>
                                        <p className="mt-1.5 mb-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                            {t('editionLocalizationCredit')}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            <a
                                                href="https://x.com/bdsqlsz"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                                            >
                                                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                                @bdsqlsz
                                            </a>
                                            <a
                                                href="https://space.bilibili.com/219296"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#00A1D6] text-white rounded-lg text-xs font-medium hover:bg-[#0090C0] transition-colors"
                                            >
                                                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                                    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z"/>
                                                </svg>
                                                青龙圣者
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pl-7 space-y-3">
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as 'en' | 'zh' | 'ja' | 'ko')}
                                    className="w-full appearance-none py-3 px-4 pr-10 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer"
                                >
                                    <option value="en">{t('english')}</option>
                                    <option value="zh">{t('chinese')}</option>
                                    <option value="ja">{t('japaneseLanguage')}</option>
                                    <option value="ko">{t('koreanLanguage')}</option>
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Theme Section */}
                

                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                            <Info size={20} />
                            <h3 className="font-semibold">{t('about')}</h3>
                        </div>
                        <div className="pl-7 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">APEXFlow</p>
                                        <p className="mt-1 text-zinc-500 dark:text-zinc-400">{t('localAIMusicGenerator')}</p>
                                    </div>
                                    <span className="rounded-full border border-[#8fb68f]/35 bg-[#8fb68f]/15 px-3 py-1 text-xs font-semibold text-[#31533a] dark:text-[#b8d8b5]">
                                        {t('version')} 2.5.0
                                    </span>
                                </div>
                                <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
                                    {t('studioDescription')}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-800/45">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{t('studioCustomization')}</p>
                                    <p className="mt-2 font-semibold text-zinc-900 dark:text-white">Mariano</p>
                                    <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        {t('studioCustomizationDescription')}
                                    </p>
                                    <div className="mt-auto pt-4 flex flex-wrap gap-2">
                                        <a
                                            href="https://x.com/Mariano_arti"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                                        >
                                            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                            @Mariano_arti
                                        </a>
                                        <a
                                            href="https://github.com/FrancoCotter/ace-step-ui"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-600"
                                        >
                                            <Github size={13} />
                                            {t('studioRepo')}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-800/45">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{t('originalProject')}</p>
                                    <p className="mt-2 font-semibold text-zinc-900 dark:text-white">Ambsd</p>
                                    <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        {t('originalProjectDescription')}
                                    </p>
                                    <div className="mt-auto pt-4 flex flex-wrap gap-2">
                                        <a
                                            href="https://x.com/AmbsdOP"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-300 dark:bg-white/70 dark:hover:bg-white"
                                        >
                                            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                            @AmbsdOP
                                        </a>
                                        <a
                                            href="https://github.com/fspecii/ace-step-ui"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-600"
                                        >
                                            <Github size={13} />
                                            {t('originalRepo')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-200 dark:border-white/5 p-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        {t('done')}
                    </button>
                </div>
            </div>

        </div>
    );
};
