'use client'

import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { HELP_TABS, DEFAULT_HELP_TAB_ID, HelpTab, HelpTabId } from '@/constants/helpContent'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: HelpTabId
  onTabChange: (tabId: HelpTabId) => void
}

export default function HelpModal({ isOpen, onClose, activeTab, onTabChange }: HelpModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const modalRoot = useMemo(() => {
    if (typeof window === 'undefined') return null
    let root = document.getElementById('modal-root')
    if (!root) {
      root = document.createElement('div')
      root.setAttribute('id', 'modal-root')
      document.body.appendChild(root)
    }
    return root
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !modalRoot) return null

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose()
    }
  }

  const renderTabContent = (tab: HelpTab) => {
    if (tab.typeList) {
      return (
        <div className="space-y-6">
          {tab.description && (
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{tab.description}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tab.typeList.map(type => (
              <div
                key={type.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm"
              >
                <span
                  className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: type.color }}
                >
                  {type.label.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {tab.sections?.map(section => (
          <section key={section.heading} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-xl">•</span>
              {section.heading}
            </h3>
            <ul className="space-y-1 pl-7 text-sm md:text-base text-gray-700 list-disc">
              {section.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    )
  }

  const activeTabContent = HELP_TABS.find(tab => tab.id === activeTab) ?? HELP_TABS.find(tab => tab.id === DEFAULT_HELP_TAB_ID) ?? HELP_TABS[0]

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="relative mx-4 w-full max-w-5xl overflow-hidden rounded-2xl bg-white/95 shadow-2xl"
        style={{ animation: 'fadeInUp 0.25s ease-out' }}
      >
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-gradient-to-b from-[#d5f6cd] via-white to-white p-6 border-b md:border-b-0 md:border-r border-[#b8e8a9]">
            <header className="mb-6">
              <h2 id="help-modal-title" className="text-2xl font-bold text-[#136c3f]">도움말</h2>
              <p className="text-sm text-[#2c7c4f]">게임을 보다 쉽게 즐길 수 있도록 안내를 확인해 보세요.</p>
            </header>
            <ul className="space-y-2">
              {HELP_TABS.map(tab => {
                const isActive = tab.id === activeTabContent.id
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-white shadow-lg ring-2 ring-[#00cc66]/40 text-[#0b5c31] font-semibold'
                          : 'bg-white/70 hover:bg-white shadow-sm text-gray-600 hover:text-[#0b5c31]'
                      }`}
                    >
                      <span className="text-xl" aria-hidden>{tab.icon}</span>
                      <span className="text-sm md:text-base">{tab.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <section className="flex-1 overflow-y-auto p-6 md:p-8 max-h-[80vh]">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="text-2xl" aria-hidden>{activeTabContent.icon}</span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{activeTabContent.title}</h3>
            </div>

            {renderTabContent(activeTabContent)}
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-red-500 hover:text-white"
          aria-label="도움말 닫기"
        >
          ✕
        </button>
      </div>
    </div>,
    modalRoot
  )
}

