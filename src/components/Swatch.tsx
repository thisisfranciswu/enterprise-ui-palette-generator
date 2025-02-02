export const Swatch = ({ id }: { id: string }) => {
  return (
    <div className="swatch" id={id}>
      <span className="value">N/A</span>
      <span className="color"></span>
    </div>
  );
};
