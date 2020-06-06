const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: ['./src/components/**/*.tsx', './src/pages/**/*.tsx'],
    theme: {
        spinner: (theme) => ({
            default: {
                color: '#fff',
                size: '1em',
                border: '2px',
                speed: '500ms',
            },
        }),
        fontFamily: {
            sans: ['Lato', ...defaultTheme.fontFamily.sans],
        },
    },
    variants: {
        borderColor: ['responsive', 'after', 'before', 'hover'],
        borderStyle: ['responsive', 'after', 'before'],
        borderWidth: ['responsive', 'after', 'before'],
        display: ['responsive', 'after', 'before'],
        flex: ['responsive', 'after', 'before'],
        margin: ['responsive', 'after', 'before', 'children', 'children-not-first'],
        padding: ['responsive', 'after', 'before', 'children', 'children-not-first'],
        spinner: ['responsive'],
    },
    plugins: [
        require('tailwindcss-pseudo-elements'),
        require('tailwindcss-children'),
        require('tailwindcss-spinner')(),
        function ({ addUtilities }) {
            addUtilities(
                {
                    '.empty-content': {
                        content: "''",
                    },
                },
                ['after', 'before'],
            );
        },
    ],
};
