import React from 'react';
import { AlgoInfo } from '../types';
import { Code, BookOpen, Clock, Database, Sparkles } from 'lucide-react';

interface InfoPanelProps {
  info: AlgoInfo | null;
  loading: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ info, loading }) => {
  return (
    <div className="flex flex-col h-full bg-dark rounded-xl border border-white/10 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-slate-800/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
           <Sparkles className="text-yellow-400" size={20}/>
           AI 算法分析 & Java 实现
        </h2>
        <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded">Gemini 2.5 Flash</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="animate-pulse text-sm">Gemini 正在分析算法细节...</p>
          </div>
        ) : info ? (
          <>
            {/* Description Card */}
            <div className="bg-slate-800/50 rounded-lg p-5 border border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-primary font-semibold border-b border-white/5 pb-2">
                <BookOpen size={18} />
                <h3>{info.name} 原理概述</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed text-justify">
                {info.description}
              </p>
            </div>

            {/* Complexity Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5 hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-accent font-semibold">
                  <Clock size={18} />
                  <h3>时间复杂度</h3>
                </div>
                <p className="text-slate-200 font-mono text-lg font-medium">{info.timeComplexity}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5 hover:border-secondary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-secondary font-semibold">
                  <Database size={18} />
                  <h3>空间复杂度</h3>
                </div>
                <p className="text-slate-200 font-mono text-lg font-medium">{info.spaceComplexity}</p>
              </div>
            </div>

            {/* Code Block */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-300 font-medium text-sm px-1">
                <Code size={16} />
                <span>标准 Java 实现代码</span>
              </div>
              <div className="bg-[#0d1117] rounded-lg border border-slate-700 overflow-hidden shadow-md">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span className="text-xs text-slate-500 font-mono">Solution.java</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-300">
                  <code>{info.javaCode}</code>
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <BookOpen size={40} strokeWidth={1} />
            <p>请选择一个排序算法以查看详情。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;