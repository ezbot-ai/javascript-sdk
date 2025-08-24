import { Prediction } from './types';

/**
 * Returns the first visual prediction matching the provided CSS selector.
 */
export function getVisualForSelector(
  predictions: ReadonlyArray<Prediction>,
  selector: string
): Prediction | undefined {
  return predictions.find(
    (pred) => pred.type === 'visual' && pred.config?.selector === selector
  );
}

/**
 * Converts visual predictions into a CSS string suitable for server-side rendering
 * within a single <style> tag.
 */
export function predictionsToCss(
  predictions: ReadonlyArray<Prediction>
): string {
  return predictions
    .filter(
      (prediction) =>
        !!prediction && prediction.type === 'visual' && !!prediction.config
    )
    .map((prediction) => {
      const { selector, action, attribute } = prediction.config!;
      const value = prediction.value;

      switch (action) {
        case 'hide':
          return `${selector} { display: none !important; }`;
        case 'show':
          return `${selector} { display: block !important; }`;
        case 'setStyle':
          return attribute
            ? `${selector} { ${attribute}: ${value} !important; }`
            : '';
        case 'setFontSize':
          return `${selector} { font-size: ${value} !important; }`;
        case 'setFontColor':
          return `${selector} { color: ${value} !important; }`;
        case 'setBackgroundColor':
          return `${selector} { background-color: ${value} !important; }`;
        case 'setVisibility':
          return `${selector} { visibility: ${value} !important; }`;
        case 'addGlobalCSS':
          return String(value ?? '');
        default:
          // ignore unsupported actions in SSR CSS generation
          return '';
      }
    })
    .filter((rule) => rule.length > 0)
    .join('\n');
}
