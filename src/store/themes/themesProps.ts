export const LigthMode = 'theme-mode-ligh';
export const DarkMode = 'theme-mode-dark';

export interface ThemeMode {
    id: string,
    name: string,
    background: string,
    class: string
}

export const ThemesMode: Array<ThemeMode> = [
    {
        id: 'light',
        name: 'Light',
        background: 'light-background',
        class: LigthMode
    },
    {
        id: 'dark',
        name: 'Dark',
        background: 'dark-background',
        class: DarkMode
    }
]

export interface ThemeColor extends ThemeMode{};

export const ThemesColors: Array<ThemeColor> = [
    {
        id: 'blue',
        name: 'Blue',
        background: 'blue-color',
        class: 'theme-color-blue'
    },
    {
        id: 'red',
        name: 'Red',
        background: 'red-color',
        class: 'theme-color-red'
    },
    {
        id: 'cyan',
        name: 'Cyan',
        background: 'cyan-color',
        class: 'theme-color-cyan'
    },
    {
        id: 'green',
        name: 'Green',
        background: 'green-color',
        class: 'theme-color-green'
    },
    {
        id: 'orange',
        name: 'Orange',
        background: 'orange-color',
        class: 'theme-color-orange'
    }
];