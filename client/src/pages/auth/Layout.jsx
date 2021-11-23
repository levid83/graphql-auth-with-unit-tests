function Layout({ children }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        padding: 10,
      }}
    >
      <div style={{ width: "100%", maxWidth: 500 }}>{children}</div>
    </div>
  );
}

export default Layout;
