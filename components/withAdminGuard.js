// No longer used. Guarding is enforced by middleware.
export default function passthrough(Component) {
  return function Guarded(props) {
    return <Component {...props} />;
  };
}


