import React, { useState, useRef, useEffect, MouseEvent } from 'react';

type RotaryKnobProps = {
    value: number
    onChange: (value: number) => void
    color?: string
    min?: number
    max?: number
    size?: number                  // ノブの表示サイズ(px)
    sensitivity?: number          // ドラッグ感度 (pxあたりどれくらい値を動かすか)
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
    value,
    onChange,
    color = "radial-gradient(circle, #666 0%, #555 60%, #444 100%)",
    min = 0,
    max = 100,
    size = 38,
    sensitivity = 0.5,
}) => {
        
    const knobRef = useRef<HTMLDivElement | null>(null)

    // knobの角度
    const [angle, setAngle] = useState<number>(0)

    // ドラッグ関連の状態
    const [isDragging, setIsDragging] = useState(false)
    const [startY, setStartY] = useState(0)       // マウスを押したときのY座標
    const [startValue, setStartValue] = useState(0) // ドラッグ開始時点でのvalue

    // 値と角度の変換関数
    const valueToAngle = (val: number): number => {
        const ratio = (val - min) / (max - min)
        return 290 * ratio - 145
    }

    // マウスを押したとき
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
        setStartY(e.clientY)
        setStartValue(value)
    }


    // ドラッグ中のマウス移動
    useEffect(() => {
        const handleMouseMove = (me: any) => {
            const e:MouseEvent = me
            if (!isDragging) return

            // マウスの動いた距離
            const deltaY = startY - e.clientY
            // 感度を掛ける
            let newValue = startValue + deltaY * sensitivity

            // min/maxで値をクランプ
            if (newValue < min) newValue = min
            if (newValue > max) newValue = max

            // 状態を更新
            // setValue(newValue)
            onChange?.(newValue)

            // 角度も更新（見た目の回転用）
            setAngle(valueToAngle(newValue))
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        // クリーンアップ
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        };
    }, [isDragging, startY, startValue, valueToAngle, onChange, sensitivity, value, min, max])


    // 初期レンダリング時や value が変わったとき
    useEffect(() => {
        // setValue(value);
        setAngle(valueToAngle(value));
    }, [value]);


    return (
        <div
            ref={knobRef}
            onMouseDown={handleMouseDown}
            className="knob"
            style={{
                width: size,
                height: size,
                transform: `rotate(${angle}deg)`,
                background: color
            }}
        >
            {/* {Math.round(value)} */}
        </div>
    )
}
