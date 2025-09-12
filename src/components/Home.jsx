import React, {useState,useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Attendence from "./Attendence.jsx";
import EmployeeRegister from "./EmployeeRegister.jsx";
import SalaryCategory from "./SalaryCategory.jsx";
import Adjestment from "./Adjestment.jsx";
import CashAdvance from "./CashAdvance.jsx";
import Bonus from "./Bonus.jsx";
import EmpSummary from "./EmpSummary.jsx";
const drawerWidth = 240;


function Home(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [activePage,setActivePage]=useState("Attendence");
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // cleanup
    }, []);

    const drawer = (
        <div style={{
            width: 240,
            backgroundColor: "#1e1e2f", // dark sidebar
            height: "100%",
            color: "#fff",
        }}>
            <Toolbar />
            <Divider />
            <List>
                {['Attendence', 'EMP Register', 'Cash Advance', 'Bonus',"Payment","Salary Category","Adjestment",'Summary'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton sx={{
                            color: activePage === text ? "#FFD700" : "#fff", // gold if active
                            backgroundColor: activePage === text ? "#33334d" : "transparent",
                            "&:hover": {
                                backgroundColor: "#55557a",
                                color: "#FFD700"
                            },
                        }} onClick={()=>{setActivePage(text); handleDrawerClose();}}>

                            <ListItemText primaryTypographyProps={{ fontWeight: activePage === text ? "bold" : "normal" }} primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const renderContent=()=>{
        switch (activePage){
            case "Attendence":
                return <Attendence/>;
            case "EMP Register":
                return <EmployeeRegister/>;
            case "Salary Category":
                return <SalaryCategory/>;
            case "Adjestment":
                return <Adjestment/>;
            case "Cash Advance":
                return <CashAdvance/>;
            case "Bonus":
                return <Bonus/>;
            case "Summary":
                return <EmpSummary/>
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` },}}>
                <Toolbar style={{
                    backgroundColor: "#1e1e2f", // dark sidebar
                    color: "#fff",
                    justifyContent: "space-between", // push content to both ends
                    alignItems: "center"
                }}>
                    <Box display="flex" alignItems="center">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" >
                        EMS-BisCare
                    </Typography>
                    </Box>
                    <Typography variant="body1" component="div">
                        {formatTime(currentTime)}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                {renderContent()}
            </Box>
        </Box>
    );
}

export default Home;