// src/theme/theme.js

import {
    createTheme
} from "@mui/material/styles";


const theme = createTheme({


    palette:{


        mode:"dark",


        primary:{

            main:"#8b5cf6",

            light:"#c084fc",

            dark:"#6d28d9"

        },


        secondary:{

            main:"#ec4899",

            light:"#f472b6",

            dark:"#be185d"

        },


        success:{

            main:"#22c55e"

        },


        warning:{

            main:"#facc15"

        },


        error:{

            main:"#ef4444"

        },


        background:{


            default:"#020617",

            paper:"#0f172a"

        },


        text:{


            primary:"#ffffff",

            secondary:"#cbd5e1"

        }

    },





    typography:{


        fontFamily:

        "Inter, Poppins, Arial, sans-serif",


        h1:{

            fontWeight:900,

            letterSpacing:"-2px"

        },


        h2:{

            fontWeight:800

        },


        h3:{

            fontWeight:800

        },


        h4:{

            fontWeight:700

        },


        h5:{

            fontWeight:700

        },


        h6:{

            fontWeight:700

        },


        button:{


            textTransform:"none",

            fontWeight:700

        }

    },





    shape:{


        borderRadius:20

    },





    components:{



        // =================================
        // GLOBAL
        // =================================


        MuiCssBaseline:{


            styleOverrides:{


                body:{


                    background:

                    `
                    radial-gradient(
                    circle at top left,
                    rgba(139,92,246,.25),
                    transparent 35%
                    ),

                    radial-gradient(
                    circle at bottom right,
                    rgba(236,72,153,.2),
                    transparent 35%
                    ),

                    #020617
                    `,


                    minHeight:"100vh",


                    overflowX:"hidden",


                    fontSmooth:"always"

                },


                "*::-webkit-scrollbar":{

                    width:"8px"

                },


                "*::-webkit-scrollbar-track":{

                    background:"#020617"

                },


                "*::-webkit-scrollbar-thumb":{

                    background:

                    "linear-gradient(#8b5cf6,#ec4899)",


                    borderRadius:"20px"

                }

            }

        },







        // =================================
        // BUTTONS
        // =================================


        MuiButton:{


            styleOverrides:{


                root:{


                    borderRadius:16,


                    padding:"13px 28px",


                    transition:

                    "all .35s ease",


                    background:

                    "linear-gradient(90deg,#8b5cf6,#ec4899)",


                    boxShadow:

                    "0 10px 30px rgba(139,92,246,.25)",



                    "&:hover":{


                        transform:

                        "translateY(-4px) scale(1.02)",


                        boxShadow:

                        "0 20px 45px rgba(236,72,153,.4)"

                    }

                }

            }

        },







        // =================================
        // CARDS
        // =================================


        MuiCard:{


            styleOverrides:{


                root:{


                    background:

                    "rgba(15,23,42,.75)",


                    backdropFilter:

                    "blur(25px)",


                    border:

                    "1px solid rgba(255,255,255,.1)",


                    boxShadow:

                    "0 30px 80px rgba(0,0,0,.45)",


                    borderRadius:28,


                    transition:

                    "all .35s ease",



                    "&:hover":{


                        transform:

                        "translateY(-6px)",


                        boxShadow:

                        "0 35px 90px rgba(139,92,246,.25)"

                    }

                }

            }

        },








        // =================================
        // TEXT FIELD
        // =================================


        MuiTextField:{


            defaultProps:{


                variant:"outlined",

                fullWidth:true

            }

        },





        MuiOutlinedInput:{


            styleOverrides:{


                root:{


                    borderRadius:16,


                    background:

                    "rgba(255,255,255,.05)",


                    transition:

                    ".3s ease",



                    "&:hover":{


                        background:

                        "rgba(255,255,255,.08)"

                    },



                    "&.Mui-focused":{


                        boxShadow:

                        "0 0 20px rgba(139,92,246,.35)"

                    }

                },



                input:{


                    color:"#fff",


                    padding:"15px"

                },



                notchedOutline:{


                    borderColor:

                    "rgba(255,255,255,.15)"

                }

            }

        },








        // =================================
        // APP BAR
        // =================================


        MuiAppBar:{


            styleOverrides:{


                root:{


                    background:

                    "rgba(15,23,42,.65)",


                    backdropFilter:

                    "blur(20px)",


                    borderBottom:

                    "1px solid rgba(255,255,255,.08)"

                }

            }

        },








        // =================================
        // CHIP
        // =================================


        MuiChip:{


            styleOverrides:{


                root:{


                    borderRadius:20,


                    fontWeight:700,


                    background:

                    "rgba(139,92,246,.18)",



                    "&:hover":{


                        boxShadow:

                        "0 0 20px rgba(139,92,246,.4)"

                    }

                }

            }

        },








        // =================================
        // DIALOG
        // =================================


        MuiDialog:{


            styleOverrides:{


                paper:{


                    background:

                    "rgba(15,23,42,.95)",


                    backdropFilter:

                    "blur(30px)",


                    borderRadius:28,


                    border:

                    "1px solid rgba(255,255,255,.1)",


                    boxShadow:

                    "0 40px 100px rgba(0,0,0,.6)"

                }

            }

        },








        // =================================
        // TOOLTIP
        // =================================


        MuiTooltip:{


            styleOverrides:{


                tooltip:{


                    background:

                    "rgba(15,23,42,.95)",


                    backdropFilter:

                    "blur(15px)",


                    border:

                    "1px solid rgba(255,255,255,.1)",


                    borderRadius:12,


                    fontSize:"13px"

                }

            }

        }

    }


});


export default theme;