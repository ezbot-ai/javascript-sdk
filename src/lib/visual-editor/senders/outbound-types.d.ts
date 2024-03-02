type ElementClickedPayload = {
  type: 'elementClicked';
  mode: 'interactive' | 'ezbot';
  element: ElementPayload;
};

type ElementPayload = {
  text: string;
  id: string;
  classes: string[];
  tag: string;
  href: string | null;
  selector: string;
  ezbotElementId: string | null;
};

export { ElementClickedPayload, ElementPayload };
