import { fuseDark } from '@fuse/fuse-colors';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';

const themesConfig = {
    default: {
        palette: {
            type: 'light',
            primary: fuseDark,
            secondary: {
                light: lightBlue[400],
                main: lightBlue[600],
                dark: lightBlue[700]
            },
            error: red
        },
        overrides: {
            MuiFormLabel: {
                asterisk: {
                    color: "#db3131",
                    fontWeight: 'bold',
                    "&$error": {
                        color: "#db3131"
                    }
                }
            }
        },
        status: {
            danger: 'orange'
        },
        typography: {
            fontFamily: ['Muli', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
            fontWeightMedium: 400,
            body1: {
                lineHeight: 1.5,
                fontWeight: 400
            },
            body2: {
                lineHeight: 1.5,
                fontWeight: 400
            }
        }
    },
    sunset: {
        palette: {
            type: 'light',
            primary: {
                light: '#ff908b',
                main: '#d0605e',
                dark: '#9b3134'
            },
            secondary: {
                light: '#c76a1d',
                main: '#ff994c',
                dark: '#ffca7b',
                contrastText: '#fff'
            },
            error: red
        },
        overrides: {
            MuiFormLabel: {
                asterisk: {
                    color: "#db3131",
                    fontWeight: 'bold',
                    "&$error": {
                        color: "#db3131"
                    }
                }
            }
        },
        status: {
            danger: 'orange'
        },
        typography: {
            fontFamily: ['Muli', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
            fontWeightMedium: 400,
            body1: {
                lineHeight: 1.5,
                fontWeight: 400
            },
            body2: {
                lineHeight: 1.5,
                fontWeight: 400
            }
        }
    },
    greeny: {
        palette: {
            type: 'light',
            primary: {
                light: '#f9c69a',
                main: '#f48d35',
                dark: '#f48d35',
                rgba: '#387ca399',
            },
            secondary: {
                light: '#3d9cb4',
                main: '#3e5790',
                dark: '#3e5790',
                contrastText: '#fff',
                rgba: '#159270',
            },
            error: red
        },
        overrides: {
            MuiFormLabel: {
                asterisk: {
                    color: "#db3131",
                    fontWeight: 'bold',
                    "&$error": {
                        color: "#db3131"
                    }
                }
            }
        },
        status: {
            danger: 'orange'
        },
        typography: {
            fontFamily: ['Muli', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
            fontWeightMedium: 400,
            body1: {
                lineHeight: 1.5,
                fontWeight: 400
            },
            body2: {
                lineHeight: 1.5,
                fontWeight: 400
            }
        }
    },
    beach: {
        palette: {
            type: 'light',
            primary: {
                light: '#c4d8dd',
                main: '#93a7ab',
                dark: '#65787c',
                contrastText: '#fff'
            },
            secondary: {
                light: '#ffb281',
                main: '#f18153',
                dark: '#ba5228',
                contrastText: '#fff'
            }
        }
    },
    tech: {
        palette: {
            type: 'light',
            primary: {
                light: '#87efff',
                main: '#4dbce9',
                dark: '#008cb7',
                contrastText: '#fff'
            },
            secondary: {
                light: '#ffff83',
                main: '#d1e751',
                dark: '#9db516'
            }
        }
    },
    sweetHues: {
        palette: {
            type: 'light',
            primary: {
                light: '#d5c1eb',
                main: '#a391b9',
                dark: '#746389',
                contrastText: '#fff'
            },
            secondary: {
                light: '#90afd4',
                main: '#6080a3',
                dark: '#325474'
            }
        }
    },
    defaultDark: {
        palette: {
            type: 'dark',
            primary: fuseDark,
            secondary: {
                light: lightBlue[400],
                main: lightBlue[600],
                dark: lightBlue[700]
            },
            error: red
        },
        status: {
            danger: 'orange'
        },
        typography: {
            fontFamily: ['Muli', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
            fontWeightMedium: 400,
            body1: {
                lineHeight: 1.5,
                fontWeight: 400
            },
            body2: {
                lineHeight: 1.5,
                fontWeight: 400
            }
        }
    },
    deepOcean: {
        palette: {
            type: 'dark',
            primary: {
                light: '#8f53e7',
                main: '#5a24b4',
                dark: '#1e0083'
            },
            secondary: {
                light: '#ff61ff',
                main: '#fe00e9',
                dark: '#c600b6',
                contrastText: '#fff'
            }
        }
    },
    slate: {
        palette: {
            type: 'dark',
            primary: {
                light: '#86fff7',
                main: '#4ecdc4',
                dark: '#009b94'
            },
            secondary: {
                light: '#ff9d99',
                main: '#ff6b6b',
                dark: '#c73840',
                contrastText: '#fff'
            }
        }
    },
    modernLuxury: {
        palette: {
            type: 'light',
            primary: {
                light: '#475b7a',
                main: '#1a2038',
                dark: '#0e1224',
                contrastText: '#ffffff'
            },
            secondary: {
                light: '#ffc875',
                main: '#ff9f43',
                dark: '#c77014',
                contrastText: '#000000'
            },
            background: {
                paper: '#ffffff',
                default: '#f4f7f6'
            },
            error: red
        },
        overrides: {
            MuiAppBar: {
                colorDefault: {
                    backgroundColor: '#1a2038',
                    color: '#ffffff'
                }
            },
            MuiPaper: {
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
            },
            MuiButton: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600
                },
                containedPrimary: {
                    boxShadow: '0 4px 14px 0 rgba(26, 32, 56, 0.39)'
                },
                containedSecondary: {
                    boxShadow: '0 4px 14px 0 rgba(255, 159, 67, 0.39)'
                }
            }
        },
        status: {
            danger: 'orange'
        }
    },
    tailadmin: {
        palette: {
            type: 'dark',
            primary: {
                light: '#425370',
                main: '#1c2434',
                dark: '#0f1624',
                contrastText: '#ffffff'
            },
            secondary: {
                light: '#5a6e8e',
                main: '#3c50e0',
                dark: '#2e3a99',
                contrastText: '#ffffff'
            },
            background: {
                paper: '#1c2434',
                default: '#1c2434'
            },
            error: red
        },
        status: {
            danger: 'orange'
        }
    },
    tailadminLight: {
        palette: {
            type: 'light',
            primary: {
                light: '#ffffff',
                main: '#ffffff',
                dark: '#f1f5f9',
                contrastText: '#1c2434'
            },
            secondary: {
                light: '#8fa0fb',
                main: '#3c50e0',
                dark: '#283ca6',
                contrastText: '#ffffff'
            },
            background: {
                paper: '#ffffff',
                default: '#f1f5f9'
            },
            error: red
        },
        status: {
            danger: 'orange'
        }
    }
};

export default themesConfig;
