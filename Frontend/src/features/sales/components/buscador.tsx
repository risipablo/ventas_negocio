import { useMemo, useState } from "react";
import { Debounce } from "../../../components/common/debounce";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { ClosedCaption, CrossIcon, Eye, Search, X } from "lucide-react";
import { Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";


const SearchBox = styled(Box)(({ show }: { show: boolean }) => ({
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    maxWidth: show ? '300px' : '0',
    overflow: 'hidden',
    marginLeft: show ? '1rem' : '0',
}));

export function Buscador({ filtrarDatos }: 
    { filtrarDatos: (value: string) => void }){
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

    const filtrarBounce = useMemo(() => Debounce((value:string) => {
        filtrarDatos(value)
    },300),[filtrarDatos])

    const handleInputChange = () => {
        const value = inputValue.trim()

        if(value){
            const palabrasClave = value.toLowerCase().split(/\s+/)
            const textBusqueda = palabrasClave.join(' ')
            filtrarBounce(textBusqueda)
            setSearching(true)
        } else {
            setSearching(false)
            filtrarDatos('')
        }
    }

    const Reset = () => {
        setInputValue("");
        setSearching(false);
        filtrarDatos('');
    }

       return (
        <Grid sx={{ margin: '2.5rem auto', display: 'flex', alignItems: 'center' }}>
            <IconButton
                sx={{ color: "#2f2f30" }}
                aria-label="search"
                onClick={() => setShowSearch(!showSearch)}
            >
                <Eye size={20} />
            </IconButton>

            <SearchBox show={showSearch}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInputChange()}
                        slotProps={{  
                            input: {
                                endAdornment: (
                                    <>
                                        {searching && (
                                            <IconButton 
                                                onClick={Reset} 
                                                size="small"
                                            >
                                                <X fontSize="small" />
                                            </IconButton>
                                        )}
                                    </>
                                ),
                            }
                        }}
                    />

                    <IconButton onClick={handleInputChange} size="small">
                        <Search size={20} />
                    </IconButton>
                </Box>
            </SearchBox>
        </Grid>
    );
}