import React, { useState } from 'react';
import { knowledge, knowledgeCategories } from '../data/knowledge';

function ArticleCard({ article }) {
  const cat = knowledgeCategories[article.category];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
          style={{ backgroundColor: cat.color }}
        >
          {cat.icon} {cat.label}
        </span>
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">{article.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{article.summary}</p>
    </div>
  );
}

function ArticleDetail({ article, onBack }) {
  const cat = knowledgeCategories[article.category];

  // Simple markdown-like rendering
  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} className="text-base font-semibold text-slate-700 mt-4 mb-2">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith('> ')) {
        return (
          <div key={i} className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 my-3">
            <p className="text-sm text-amber-800">{trimmed.slice(2)}</p>
          </div>
        );
      }
      if (trimmed.startsWith('⚠️')) {
        return (
          <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3 my-3">
            <p className="text-sm text-red-700">{trimmed}</p>
          </div>
        );
      }
      if (trimmed.startsWith('💡')) {
        return (
          <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-3">
            <p className="text-sm text-blue-700">{trimmed}</p>
          </div>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={i} className="text-sm text-slate-600 ml-4 mb-1">{trimmed.slice(2)}</li>
        );
      }
      if (trimmed.match(/^\d+\./)) {
        return (
          <li key={i} className="text-sm text-slate-600 ml-4 mb-1">{trimmed}</li>
        );
      }
      if (trimmed === '---') {
        return <hr key={i} className="my-4 border-slate-200" />;
      }
      if (trimmed.startsWith('```') || trimmed === '```') {
        return null; // Skip code blocks in this simple renderer
      }
      if (trimmed === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-sm text-slate-600 mb-1">{trimmed}</p>;
    });
  };

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-4 flex items-center gap-1"
      >
        ← 返回知识库
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
            style={{ backgroundColor: cat.color }}
          >
            {cat.icon} {cat.label}
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{article.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{article.summary}</p>
        <div className="prose prose-sm max-w-none">{renderContent(article.content)}</div>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredKnowledge = filter === 'all'
    ? knowledge
    : knowledge.filter(a => a.category === filter);

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">📚 知识库</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">了解颈椎健康知识，从根本上预防和管理问题</p>

      {/* Category filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
            filter === 'all' ? 'bg-green-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          全部 ({knowledge.length})
        </button>
        {Object.entries(knowledgeCategories).map(([key, cat]) => {
          const count = knowledge.filter(a => a.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                filter === key ? 'text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
              style={filter === key ? { backgroundColor: cat.color } : {}}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filteredKnowledge.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="w-full text-left"
          >
            <ArticleCard article={article} />
          </button>
        ))}
      </div>

      {/* Contribution call */}
      <div className="bg-green-50 rounded-xl p-5 border border-green-200 mt-6">
        <h3 className="text-sm font-semibold text-green-800 mb-2">✍️ 贡献知识</h3>
        <p className="text-sm text-green-700 mb-2">
          知识库内容欢迎大家贡献！如果你有颈椎健康相关的专业知识和经验，欢迎提交 PR。
        </p>
        <p className="text-xs text-green-600">
          内容位于 src/data/knowledge.js，按照 Markdown 格式编写即可。
        </p>
      </div>
    </div>
  );
}
