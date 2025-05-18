import {
  Handle,
  type NodeProps,
  Position,
  type Node,
  NodeResizer,
} from "@xyflow/react";
import useStore from "../store/store";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type NodeData = {
  label: string;
  onDelete?: (id: string) => void;
};

function getTextWidth(text: string, font: string = "16px sans-serif"): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 100;
  context.font = font;
  return context.measureText(text).width + 20; // padding 여유
}

function MindMapNode({ id, data, selected }: NodeProps<Node<NodeData>>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const [minWidth, setMinWidth] = useState(100);

  // label이 바뀔 때마다 실제 텍스트 길이에 따라 width 조정
  useLayoutEffect(() => {
    if (inputRef.current) {
      const font = getComputedStyle(inputRef.current).font;
      const width = getTextWidth(data.label, font);
      inputRef.current.style.width = `${width}px`;
      setMinWidth(width);
    }
  }, [data.label]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }, 1);
  }, []);

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={minWidth}
        minHeight={30}
      />
      <div className="inputWrapper relative">
        <button
          onClick={(e) => {
            e.stopPropagation(); // 드래그 이벤트 등 부모로 이벤트 전파 막기
            data.onDelete?.(id);
          }}
          onMouseDown={(e) => e.stopPropagation()} // mousedown도 막아주기
          className="absolute -top-1 -right-2 bg-white border border-gray-300 rounded-full w-2 h-2 flex items-center justify-center text-xs text-red-500 hover:bg-red-100 z-10"
          title="노드 삭제"
          style={{ pointerEvents: "auto" }} // 명확하게 포인터 이벤트 허용
        >
          ×
        </button>

        <div className="dragHandle">
          <svg viewBox="0 0 24 24">
            <path
              fill="#333"
              stroke="#333"
              strokeWidth="1"
              d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
            />
          </svg>
        </div>
        <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        />
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default MindMapNode;
