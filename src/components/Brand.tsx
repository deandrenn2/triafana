import React from 'react'

export default function Brand() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '24px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            maxWidth: '340px',
            margin: '0 auto',
            textAlign: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                    src="/triafana-logo.png"
                    alt="TRIAFANA Store"
                    width={50}
                    height={50}
                    style={{
                        flexShrink: 0,
                        display: 'block',
                        filter: 'drop-shadow(0px 4px 10px rgba(10, 102, 109, 0.3))',
                        borderRadius: '12px'
                    }}
                />
                <span
                    style={{
                        background: 'linear-gradient(90deg, #10beca 0%, #14949E 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900,
                        fontSize: '24px',
                        letterSpacing: '0.12em',
                        fontFamily: 'Sora, Segoe UI, system-ui, sans-serif',
                        whiteSpace: 'nowrap',
                    }}
                >
                    TRIAFANA
                </span>
            </div>

            <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#a3a3a3',
                fontFamily: 'Segoe UI, system-ui, sans-serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 500,
                opacity: 0.8
            }}>
                Panel de Administración
            </p>
        </div>
    )
}
