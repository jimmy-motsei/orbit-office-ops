/**
 * Maru Chatbot Icon Component
 * 
 * Modern chat button with Maru cyan gradient branding
 * Copy this code to your maru-chatbot project
 */

import React, { useState } from 'react';

export default function MaruChatbotIcon() {
  const [unreadCount, setUnreadCount] = useState(1); // Set to 0 to hide badge
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="maru-chat-button"
      aria-label="Open chat"
    >
      {/* Chat Icon SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chat-icon"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          fill="white"
        />
        {/* Three dots inside chat bubble */}
        <circle cx="8" cy="10" r="1.5" fill="#00D9FF" />
        <circle cx="12" cy="10" r="1.5" fill="#00D9FF" />
        <circle cx="16" cy="10" r="1.5" fill="#00D9FF" />
      </svg>

      {/* "Chat" Text */}
      <span className="chat-text">Chat</span>

      {/* Notification Badge */}
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}

      <style jsx>{`
        .maru-chat-button {
          /* Position */
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;

          /* Layout */
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;

          /* Styling */
          background: linear-gradient(135deg, #00D9FF 0%, #0099FF 100%);
          border: none;
          border-radius: 50px;
          box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3),
                      0 4px 8px rgba(0, 0, 0, 0.1);
          
          /* Animation */
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }

        .maru-chat-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 217, 255, 0.4),
                      0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .maru-chat-button:active {
          transform: translateY(-2px);
        }

        /* Chat Icon */
        .chat-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        /* Chat Text */
        .chat-text {
          color: white;
          font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        /* Notification Badge */
        .notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          
          display: flex;
          align-items: center;
          justify-content: center;
          
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          
          background: #FF3B30;
          border: 2px solid white;
          border-radius: 10px;
          
          color: white;
          font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
        }

        /* Pulsing Animation (optional) */
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3),
                        0 4px 8px rgba(0, 0, 0, 0.1),
                        0 0 0 0 rgba(0, 217, 255, 0.4);
          }
          50% {
            box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3),
                        0 4px 8px rgba(0, 0, 0, 0.1),
                        0 0 0 8px rgba(0, 217, 255, 0);
          }
        }

        /* Add pulse animation when there are unread messages */
        .maru-chat-button:has(.notification-badge) {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .maru-chat-button {
            bottom: 16px;
            right: 16px;
            padding: 10px 16px;
          }

          .chat-text {
            font-size: 14px;
          }

          .chat-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </button>
  );
}
