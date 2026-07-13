type Props = {
  document: {
    title: string;
    version: string;
    content: string;
  };
};

export default function AgreementViewer({
  document,
}: Props) {
  return (
    <section
      style={{
        background: "#171717",
        borderRadius: 20,
        padding: 30,
        border: "1px solid #2a2a2a",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          fontSize: 34,
          fontWeight: 800,
        }}
      >
        {document.title}
      </h2>

      <p
        style={{
          color: "#999",
          marginBottom: 24,
        }}
      >
        Versión {document.version}
      </p>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "inherit",
          lineHeight: 1.8,
          margin: 0,
          color: "#f2f2f2",
        }}
      >
        {document.content}
      </pre>
    </section>
  );
}