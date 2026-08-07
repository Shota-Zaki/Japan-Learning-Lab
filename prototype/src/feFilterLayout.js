const DEFAULT_FE_FILTER_LAYOUT = "2";
const FE_FILTER_LAYOUTS = new Set(["1", "2", "3"]);

export function resolveFeFilterLayoutVariant(search = "") {
  const params = new URLSearchParams(search);
  const requested = params.get("filterLayout");
  return FE_FILTER_LAYOUTS.has(requested) ? requested : DEFAULT_FE_FILTER_LAYOUT;
}
