import { isPercentVisible, isWithinTriggers } from '../geometry';

// Container spans 100..900 (800 tall) in every case.
const visible = (start: number, size: number, threshold: number) =>
  isPercentVisible(start, size, 100, 900, threshold);

describe('isPercentVisible', () => {
  it('needs the whole child on screen at threshold 1', () => {
    expect(visible(200, 300, 1)).toBe(true);
    expect(visible(650, 300, 1)).toBe(false);
  });

  it('passes partial thresholds', () => {
    expect(visible(750, 200, 0.5)).toBe(true); // 150 of 200 visible
    expect(visible(850, 200, 0.5)).toBe(false); // 50 of 200 visible
  });

  it('treats a child taller than the container as fully visible when it fills it', () => {
    expect(visible(0, 2000, 1)).toBe(true);
    expect(visible(500, 2000, 1)).toBe(false);
  });

  it('never fires for an offscreen child or an unmeasured container', () => {
    expect(visible(1000, 100, 0)).toBe(false);
    expect(isPercentVisible(0, 100, 0, 0, 0.5)).toBe(false);
  });
});

describe('isWithinTriggers', () => {
  it('detects overlap with the trigger zone', () => {
    expect(isWithinTriggers(850, 950, 50, 900)).toBe(true);
    expect(isWithinTriggers(950, 1050, 50, 900)).toBe(false);
    expect(isWithinTriggers(-100, 40, 50, 900)).toBe(false);
  });
});
