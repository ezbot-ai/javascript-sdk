/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { Prediction } from './types';
import * as visualChanges from './visualChanges';

// Mock console.log
const logSpy = jest.spyOn(console, 'log');
logSpy.mockImplementation(() => {});

describe('visualChanges', () => {
  describe('setElementText', () => {
    it('sets the text of the given element', () => {
      const div = document.createElement('div');
      const text = 'some_text';

      visualChanges.setElementText(div, text);
      expect(div.textContent).toBe(text);
    });
  });
  describe('setElementInnerHTML', () => {
    it('sets the inner HTML of the given element', () => {
      const div = document.createElement('div');
      const innerHTML = '<h1>Heading</h1>';

      visualChanges.setElementInnerHTML(div, innerHTML);
      expect(div.innerHTML).toBe(innerHTML);
    });
  });
  describe('setElementAttribute', () => {
    it('sets the attribute of the given element', () => {
      const div = document.createElement('img');
      const attribute = 'alt';
      const value = 'some alt text';

      visualChanges.setElementAttribute(div, attribute, value);
      expect(div.getAttribute(attribute)).toBe(value);
    });
  });
  describe('addClassesToElement', () => {
    it('adds the given classes to the element', () => {
      const div = document.createElement('div');
      const classes = ['class1', 'class2'];

      visualChanges.addClassesToElement(div, classes);
      expect(div.classList.contains(classes[0])).toBe(true);
      expect(div.classList.contains(classes[1])).toBe(true);
    });
    it('logs a message if no classes are given', () => {
      const div = document.createElement('div');
      const classes: string[] = [];

      visualChanges.addClassesToElement(div, classes);
      expect(logSpy).toHaveBeenCalledWith(`No classes to add to element.`);
    });
  });
  describe('removeClassesFromElement', () => {
    it('removes the given classes from the element', () => {
      const div = document.createElement('div');
      const classes = ['class1', 'class2'];
      div.classList.add(classes[0]);
      div.classList.add(classes[1]);

      visualChanges.removeClassesFromElement(div, classes);
      expect(div.classList.contains(classes[0])).toBe(false);
      expect(div.classList.contains(classes[1])).toBe(false);
    });
    it('logs a message if no classes are given', () => {
      const div = document.createElement('div');
      const classes: string[] = [];

      visualChanges.removeClassesFromElement(div, classes);
      expect(logSpy).toHaveBeenCalledWith(`No classes to remove from element.`);
    });
  });
  describe('setElementStyle', () => {
    it('sets the style of the given element', () => {
      const div = document.createElement('div');
      const style = 'color: red;';

      visualChanges.setElementStyle(div, style);
      expect(div.getAttribute('style')).toBe(style);
    });
  });
  describe('setElementHref', () => {
    it('sets the href of the given anchor element', () => {
      const anchor = document.createElement('a');
      const href = 'https://some.url';

      visualChanges.setElementHref(anchor, href);
      expect(anchor.getAttribute('href')).toBe(href);
    });
  });
  describe('setElementSrc', () => {
    it('sets the src of the given image element', () => {
      const img = document.createElement('img');
      const src = 'https://some.url';

      visualChanges.setElementSrc(img, src);
      expect(img.getAttribute('src')).toBe(src);
    });
  });
  describe('hideElement', () => {
    it('hides the given element', () => {
      const div = document.createElement('div');
      div.style.display = 'block';
      div.style.visibility = 'visible';

      visualChanges.hideElement(div);
      expect(div.style.display).toBe('none');
      expect(div.style.visibility).toBe('hidden');
    });
  });
  describe('showElement', () => {
    it('shows the given element', () => {
      const div = document.createElement('div');
      div.style.display = 'none';
      div.style.visibility = 'hidden';

      visualChanges.showElement(div);
      expect(div.style.display).toBe('block');
      expect(div.style.visibility).toBe('visible');
    });
  });
  describe('validateVisualPrediction', () => {
    it('returns an error message if no config is found', () => {
      const prediction: Prediction = {
        key: 'some_key',
        value: 'some_value',
        config: null,
        type: 'some_type',
        version: '1.0',
      };
      const result = visualChanges.validateVisualPrediction(prediction);
      expect(result).toBe(
        `No config found for prediction with key: ${prediction.key}. Skipping its visual change.`
      );
    });
    it('returns an error message if no selector is found', () => {
      const prediction: Prediction = {
        key: 'some_key',
        value: 'some_value',
        config: { selector: '', action: 'show' },
        type: 'some_type',
        version: '1.0',
      };
      const result = visualChanges.validateVisualPrediction(prediction);
      expect(result).toBe(
        `No selector found for prediction with key: ${prediction.key}. Skipping its visual change.`
      );
    });
    it('return null if the predictions is valid', () => {
      const prediction: Prediction = {
        key: 'some_key',
        value: 'some_value',
        config: { selector: 'some_selector', action: 'show' },
        type: 'some_type',
        version: '1.0',
      };
      const result = visualChanges.validateVisualPrediction(prediction);
      expect(result).toBe(null);
    });
  });
  describe('makeVisualChange', () => {
    describe('with a setText action', () => {
      it('sets the text of the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'some_value',
          config: { selector: '#test', action: 'setText' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.textContent).toBe(prediction.value);
      });
    });
    describe('with a setInnerHTML action', () => {
      it('sets the inner HTML of the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: '<h1>Heading</h1>',
          config: { selector: '#test', action: 'setInnerHTML' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.innerHTML).toBe(prediction.value);
      });
    });
    describe('with a setAttribute action', () => {
      it('sets the attribute of the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'some_value',
          config: {
            selector: '#test',
            action: 'setAttribute',
            attribute: 'data-test',
          },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.getAttribute('data-test')).toBe(prediction.value);
      });
      it('logs a message if no attribute is found', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'some_value',
          config: { selector: '#test', action: 'setAttribute' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(logSpy).toHaveBeenCalledWith(
          `No attribute found for prediction with key: ${prediction.key}. Skipping its visual change.`
        );
      });
    });
    describe('with a addClasses action', () => {
      it('adds the classes to the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'class1,class2',
          config: { selector: '#test', action: 'addClasses' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.classList.contains('class1')).toBe(true);
        expect(div.classList.contains('class2')).toBe(true);
      });
      it('logs a message if no classes are found', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: '',
          config: { selector: '#test', action: 'addClasses' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(logSpy).toHaveBeenCalledWith(`No classes to add to element.`);
      });
    });
    describe('with a removeClasses action', () => {
      it('removes the classes from the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        div.classList.add('class1');
        div.classList.add('class2');
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'class1,class2',
          config: { selector: '#test', action: 'removeClasses' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.classList.contains('class1')).toBe(false);
        expect(div.classList.contains('class2')).toBe(false);
      });
      it('logs a message if no classes are found', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: '',
          config: { selector: '#test', action: 'removeClasses' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(logSpy).toHaveBeenCalledWith(
          `No classes to remove from element.`
        );
      });
    });
    describe('with a setHref action', () => {
      it('sets the href of the anchor element', () => {
        const anchor = document.createElement('a');
        anchor.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(anchor);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'https://some.url',
          config: { selector: '#test', action: 'setHref' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(anchor.getAttribute('href')).toBe(prediction.value);
      });
    });
    describe('with a setStyle action', () => {
      it('sets the style of the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'color: red;',
          config: { selector: '#test', action: 'setStyle' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.getAttribute('style')).toBe(prediction.value);
      });
    });
    describe('with a setSrc action', () => {
      it('sets the src of the image element', () => {
        const img = document.createElement('img');
        img.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(img);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'https://some.url',
          config: { selector: '#test', action: 'setSrc' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(img.getAttribute('src')).toBe(prediction.value);
      });
    });
    describe('with a hide action', () => {
      it('hides the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'some_value',
          config: { selector: '#test', action: 'hide' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.style.display).toBe('none');
        expect(div.style.visibility).toBe('hidden');
      });
    });
    describe('with a show action', () => {
      it('shows the element', () => {
        const div = document.createElement('div');
        div.id = 'test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(div);
        const prediction: Prediction = {
          key: 'some_key',
          value: 'some_value',
          config: { selector: '#test', action: 'show' },
          type: 'visual',
          version: '2.0',
        };

        visualChanges.makeVisualChange(prediction);
        expect(div.style.display).toBe('block');
        expect(div.style.visibility).toBe('visible');
      });
    });
  });
  describe('makeVisualChanges', () => {
    it('makes visual changes for each prediction', () => {
      const div1 = document.createElement('div');
      div1.id = 'test1';
      document.body.appendChild(div1);
      const div2 = document.createElement('div');
      div2.id = 'test2';
      document.body.appendChild(div2);
      jest.spyOn(document, 'querySelector').mockReturnValue(div2);
      const predictions: Prediction[] = [
        {
          key: 'some_key',
          value: 'some_value',
          config: { selector: '#test1', action: 'setText' },
          type: 'visual',
          version: '2.0',
        },
        {
          key: 'some_key',
          value: 'some_value',
          config: { selector: '#test2', action: 'setText' },
          type: 'visual',
          version: '2.0',
        },
      ];
      // @ts-expect-error:next-line
      window.ezbot = { predictions };
      visualChanges.makeVisualChanges();
      expect(div2.textContent).toBe(predictions[1].value);
    });
  });
});
