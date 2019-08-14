import { update, get } from './update';

describe('update()', () => {
  it('should only update the given property of an object', () => {
    const tmp = update({
      route: {
        path: '/test/path',
        updatedByBrowser: true,
      },
      projects: ['1'],
    }, ['route'], {
      path: '/new/path',
    });

    expect(tmp.projects.length).toEqual(1);
    expect(tmp.route.updatedByBrowser).toBeTruthy();
    expect(tmp.route.path).toBe('/new/path');
  });

  it('should replace the value of the given property', () => {
    const tmp = update({
      route: {
        path: '/test/path',
        other: 'other',
      },
    }, [], { route: { path: '/test/path' }});

    expect(tmp.route.path).toBe('/test/path');
    expect(tmp.route.other).toBeUndefined();
  });

  it('should allow updating multiple properties of a same level', () => {
    const tmp = update({
      route: {
        path: '/test/path',
        updatedByBrowser: true,
      },
      projects: ['1'],
      virtualDatasets: ['1'],
    }, [], {
      projects: ['1', '2'],
      virtualDatasets: ['1', '2'],
    });

    expect(tmp.projects.length).toEqual(2);
    expect(tmp.virtualDatasets.length).toEqual(2);
    expect(tmp.route.updatedByBrowser).toBeTruthy();
    expect(tmp.route.path).toBe('/test/path');
  });

  it('should create the object if it is undefined', () => {
    const tmp = update({
      route: {
        path: '/test/path',
      },
    }, [], {
      somethingNew: ['1', '2', '3'],
    });

    expect(tmp.route.path).toBe('/test/path');
    expect(tmp.somethingNew.length).toBe(3);
  });

  it('should deal with updated value of "undefined"', () => {
    const tmp = update({
      route: {
        path: '/test/path',
      },
      projects: ['1'],
    }, ['route'], undefined);

    expect(tmp.route.path).toBe('/test/path');
    expect(tmp.projects.length).toBe(1);
  });

  it('should update value of an undefined property', () => {
    const tmp = update({
      route: {
        path: '/test/path',
      },
    }, ['project', 'name'], { test: 'test'});

    expect(tmp.route.path).toBe('/test/path');
    expect(tmp.project.name.test).toBe('test');
  });

  it('should clear value of the given property path', () => {
    const undefinedFunc = () => undefined;
    let tmp = update({
      route: {
        path: '/test/path',
      },
    }, ['route'], undefinedFunc);

    expect(tmp.route).toBeUndefined();

    tmp = update({
      route: {
        path: '/test/path',
      },
    }, [], { route: undefinedFunc });

    expect(tmp.route).toEqual(undefinedFunc);
  });
});

describe('getSourceData()', () => {
  const testObject = {
    name: 'test',
    data: {
      param1: 'value',
    },
  };

  it('should return correct source data', () => {
    expect(get(testObject, ['data', 'param1'])).toEqual('value');
  });

  it('should deal with empty path array or non-existed property', () => {
    expect(get(testObject, [])).toEqual(testObject);
    expect(get(testObject, undefined)).toEqual(testObject);
    expect(get(testObject, ['data', 'incorrectParam1', 'incorrectProperty'])).toBeUndefined();
  });
});
