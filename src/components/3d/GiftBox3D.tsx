'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { BoxStyle, BOX_STYLES } from '@/lib/contract';

interface GiftBox3DProps {
    boxStyle: BoxStyle;
    isShaking?: boolean;
    isExploding?: boolean;
}

function GiftBoxMesh({ boxStyle, isShaking, isExploding }: GiftBox3DProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const shakeIntensity = useRef(0);
    const explosionProgress = useRef(0);

    // Get colors based on style
    const colors = useMemo(() => {
        switch (boxStyle) {
            case BoxStyle.Silver:
                return { main: '#C0C0C0', emissive: '#888888', ribbon: '#E8E8E8' };
            case BoxStyle.Gold:
                return { main: '#D4AF37', emissive: '#8B7500', ribbon: '#F4D03F' };
            case BoxStyle.Obsidian:
            default:
                return { main: '#1A1A2E', emissive: '#4A4A6A', ribbon: '#2D2D44' };
        }
    }, [boxStyle]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Shake animation
        if (isShaking) {
            shakeIntensity.current = Math.min(shakeIntensity.current + delta * 2, 1);
            const shake = Math.sin(state.clock.elapsedTime * 30) * 0.05 * shakeIntensity.current;
            meshRef.current.rotation.z = shake;
            meshRef.current.rotation.x = shake * 0.5;
        } else {
            shakeIntensity.current = Math.max(shakeIntensity.current - delta * 3, 0);
            if (shakeIntensity.current > 0) {
                const shake = Math.sin(state.clock.elapsedTime * 30) * 0.05 * shakeIntensity.current;
                meshRef.current.rotation.z = shake;
            }
        }

        // Explosion animation
        if (isExploding) {
            explosionProgress.current = Math.min(explosionProgress.current + delta * 2, 1);
            const scale = 1 - explosionProgress.current;
            meshRef.current.scale.setScalar(Math.max(scale, 0.01));
            meshRef.current.rotation.y += delta * 10;
        }

        // Glow pulse
        if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
            meshRef.current.material.emissiveIntensity = isShaking ? pulse * 2 : pulse;
        }
    });

    if (isExploding && explosionProgress.current >= 1) {
        return null;
    }

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <group>
                {/* Main Box */}
                <mesh ref={meshRef} castShadow>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial
                        color={colors.main}
                        emissive={colors.emissive}
                        emissiveIntensity={0.5}
                        metalness={boxStyle === BoxStyle.Gold ? 0.9 : 0.7}
                        roughness={boxStyle === BoxStyle.Obsidian ? 0.3 : 0.2}
                    />
                </mesh>

                {/* Ribbon Cross */}
                <mesh position={[0, 0, 1.01]}>
                    <boxGeometry args={[0.3, 2.1, 0.02]} />
                    <meshStandardMaterial
                        color={colors.ribbon}
                        emissive={colors.ribbon}
                        emissiveIntensity={0.3}
                        metalness={0.8}
                        roughness={0.1}
                    />
                </mesh>
                <mesh position={[1.01, 0, 0]}>
                    <boxGeometry args={[0.02, 2.1, 0.3]} />
                    <meshStandardMaterial
                        color={colors.ribbon}
                        emissive={colors.ribbon}
                        emissiveIntensity={0.3}
                        metalness={0.8}
                        roughness={0.1}
                    />
                </mesh>

                {/* Bow */}
                <mesh position={[0, 1.1, 0]} rotation={[0.3, 0, 0]}>
                    <torusGeometry args={[0.3, 0.08, 16, 32]} />
                    <meshStandardMaterial
                        color={colors.ribbon}
                        emissive={colors.ribbon}
                        emissiveIntensity={0.5}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            </group>
        </Float>
    );
}

export function GiftBox3D({ boxStyle, isShaking = false, isExploding = false }: GiftBox3DProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
                style={{ background: 'transparent' }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />

                <GiftBoxMesh
                    boxStyle={boxStyle}
                    isShaking={isShaking}
                    isExploding={isExploding}
                />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
