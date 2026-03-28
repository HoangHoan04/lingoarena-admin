export default function Title({ children }: { children?: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontStyle: "italic",
        width: "100%",
        textAlign: "center",
        fontSize: "1.75rem",
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}
