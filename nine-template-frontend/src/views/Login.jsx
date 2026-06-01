import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@ninebone/util';

export const LoginPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 로딩 애니메이션용 상태

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const data = await api.post("/auth/login", { username, password });

            // 부모 상태 갱신 및 리다이렉트
            onLoginSuccess(data.accessToken, data.username);
            nine.alert('로그인 성공!');
            navigate('/', { replace: true });
        } catch (err) {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>NINE TEMPLATE</h2>
                    <p style={styles.subtitle}>인증 파이프라인 연결을 위한 로그인</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>ID</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            style={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            style={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div style={styles.errorContainer}>
                            <span style={styles.errorText}>⚠️ {error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isLoading ? styles.buttonDisabled : {})
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? '인증 요청 중...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// 🎯 하단에 깔끔하게 분리한 모던 스타일 정의 블록
const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // 개발자 친화적인 딥 다크 브라운 네이비
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    card: {
        width: '360px',
        padding: '40px',
        borderRadius: '12px',
        backgroundColor: '#2b2b36', // 인텔리제이 테마와 유사한 다크 그레이
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        border: '1px solid #3f3f4e',
        transition: 'all 0.3s ease'
    },
    header: {
        textAlign: 'center',
        removeAttribute: '10px',
        marginBottom: '30px'
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: '1px'
    },
    subtitle: {
        margin: 0,
        fontSize: '13px',
        color: '#8e8e9e'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '11px',
        fontWeight: '6px',
        color: '#b4b4c6',
        letterSpacing: '0.5px',
        textAlign: 'left',
        paddingLeft: '4px'
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        boxSizing: 'border-box',
        border: '1px solid #4f4f64',
        borderRadius: '6px',
        backgroundColor: '#202029',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        ':focus': {
            borderColor: '#007bff'
        }
    },
    errorContainer: {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        border: '1px solid rgba(220, 53, 69, 0.2)',
        padding: '10px',
        borderRadius: '6px'
    },
    errorText: {
        color: '#ff6b7b',
        fontSize: '13px'
    },
    button: {
        width: '100%',
        padding: '14px',
        background: '#4f46e5', // 세련된 인디고 블루 톤
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'background 0.2s ease, transform 0.1s ease',
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
    },
    buttonDisabled: {
        background: '#3b3b4a',
        color: '#717185',
        cursor: 'not-allowed',
        boxShadow: 'none'
    }
};