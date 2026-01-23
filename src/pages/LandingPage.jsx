import React from 'react';
import { PixelButton, PixelHeading, PixelContainer } from '../components/ui/PixelUI';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                >
                    {/* Replace with actual game video URL or local file path */}
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-glitchy-pixel-art-background-30232-large.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4">
                <PixelHeading level={1} className="text-4xl md:text-6xl mb-8 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    PIXEL QUEST
                </PixelHeading>

                <PixelContainer dark title="WELCOME BRAVE ADVENTURER" className="max-w-2xl mb-8">
                    <p className="mb-6 text-sm md:text-base leading-relaxed">
                        Embark on an epic 8-bit journey through the digital realm.
                        Battle glitches, collect bytes, and restore order to the Source Code!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <PixelButton color="primary" onClick={() => navigate('/auth')}>
                            PLAY NOW
                        </PixelButton>
                        <PixelButton onClick={() => navigate('/polls')}>
                            COMMUNITY POLLS
                        </PixelButton>
                    </div>
                </PixelContainer>

                <div className="flex justify-center gap-6">
                    <i className="nes-icon github is-medium clickable" onClick={() => window.open('https://github.com', '_blank')}></i>
                    <i className="nes-icon twitter is-medium clickable" onClick={() => window.open('https://twitter.com', '_blank')}></i>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
