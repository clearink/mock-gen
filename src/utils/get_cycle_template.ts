export default function getCycleTemplate(template: Record<string, any>, paths: string[]) {}
const template = {
  tree: {
    mock_type: {
      name: { mock_type: '@cname()' },
      value: { mock_type: '@integer(0, 6)' },
      key: { mock_type: '@word()' },
    },
  },
  a: {
    mock_rule: '6-15',
    mock_type: [{ aa: { mock_type: '@word()' }, bb: { mock_type: '@integer(0, 6)' } }],
  },
  b: {
    mock_type: {
      aa: { mock_type: '@word()' },
      bb: { mock_type: '@word()' },
      cc: { mock_type: '@word()' },
    },
  },
  c: {
    mock_type: {
      id: { mock_type: '@id()' },
      username: { mock_type: '@cname()' },
      firstName: { mock_type: '@word()' },
      lastName: { mock_type: '@word()' },
      email: { mock_type: '@email()' },
      password: { mock_type: '@word()' },
      phone: { mock_type: '@word()' },
    },
  },
  d: {
    mock_type: {
      e: { mock_type: '@word()' },
      f: { mock_type: '@word()' },
      g: {
        mock_type: {
          h: { mock_type: '@float(0, 6)' },
          i: { mock_type: '@integer(0, 6)' },
          j: {
            mock_type: {
              k: { mock_type: '@integer(0, 6)' },
              l: { mock_type: '@word()' },
              // m 是对象 
              // m: { mock_type: {} },

              // m 是数组 cycle_path = ['d', 'g']
              // getCycleTemplate 要如何写呢?
              m: { mock_rule: '6-15', mock_type: ['@word(0, 6)'] },
            },
          },
        },
      },
    },
  },
}
