export default function CustomNode({ data }: any) {
  return (
    <div
      style={{
        padding: 10,
        border: "2px solid #333",
        borderRadius: 5,
        background: "#f0f0f0",
        cursor: "grab",
      }}
    >
      {data.label}
    </div>
  );
}
