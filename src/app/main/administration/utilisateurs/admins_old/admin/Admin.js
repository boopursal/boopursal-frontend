import React, {useEffect, useState, useRef} from 'react';
import {Button, Tab, Tabs, TextField, InputAdornment, Icon, Typography} from '@material-ui/core';
import {orange} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate, FusePageCarded, FuseChipSelect, FuseUtils, TextFieldFormsy} from '@fuse';
import {useForm} from '@fuse/hooks';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import _ from '@lodash';
import {useDispatch, useSelector} from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Formsy from 'formsy-react';

const useStyles = makeStyles(theme => ({
    adminImageFeaturedStar: {
        position: 'absolute',
        top     : 0,
        right   : 0,
        color   : orange[400],
        opacity : 0
    },
    adminImageUpload      : {
        transitionProperty      : 'box-shadow',
        transitionDuration      : theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
    adminImageItem        : {
        transitionProperty      : 'box-shadow',
        transitionDuration      : theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover'               : {
            '& $adminImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured'            : {
            pointerEvents                      : 'none',
            boxShadow                          : theme.shadows[3],
            '& $adminImageFeaturedStar'      : {
                opacity: 1
            },
            '&:hover $adminImageFeaturedStar': {
                opacity: 1
            }
        }
    }
}));
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
function Admin(props)
{
    const dispatch = useDispatch();
    const admin = useSelector(({adminsApp}) => adminsApp.admin);

    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);
    const {form, handleChange, setForm} = useForm(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    
    useEffect(() => {
        function updateAdminState()
        {
            const params = props.match.params;
            const {adminId} = params;

            if ( adminId === 'new' )
            {
                dispatch(Actions.newAdmin());
            }
            else
            {
                dispatch(Actions.getAdmin(props.match.params));
            }
        }

        updateAdminState();
    }, [dispatch, props.match.params]);

    useEffect(() => {
        if (
            (admin.data && !form) ||
            (admin.data && form && admin.data.id !== form.id)
        )
        {
            setForm(admin.data);
        }
    }, [form, admin.data, setForm]);

    function handleChangeTab(event, tabValue)
    {
        setTabValue(tabValue);
    }

    function handleChipChange(value, name)
    {
        //setForm(_.set({...form}, name, value.map(item => item.value)));
        setForm(_.set({...form}, name, value));
    }

    function setFeaturedImage(id)
    {
        setForm(_.set({...form}, 'featuredImageId', id));
    }

    function handleUploadChange(e)
    {
        const file = e.target.files[0];
        if ( !file )
        {
            return;
        }
        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            setForm(_.set({...form}, `images`,
                [
                    {
                        'id'  : FuseUtils.generateGUID(),
                        'url' : `data:${file.type};base64,${btoa(reader.result)}`,
                        'type': 'image'
                    },
                    ...form.images
                ]
            ));
        };

        reader.onerror = function () {
            console.log("error on load image");
        };
    }

    function canBeSubmitted()
    {
        return (
            form.name.length > 0 &&
            !_.isEqual(admin.data, form)
        );
    }

    function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
    }

    function handleSubmit(event)
    {
        //event.preventDefault();
        if ( props.match.params === 'new' )
        {
            dispatch(Actions.saveAdmin(form));
        }
        else
        {
            dispatch(Actions.saveAdmin(form));
        }
    }
    
    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header : "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                form && (
                    <div className="flex flex-1 w-full items-center justify-between">

                        <div className="flex flex-col items-start max-w-full">

                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/users/admins" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    Admins
                                </Typography>
                            </FuseAnimate>

                            <div className="flex items-center max-w-full">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    {form.images.length > 0 && form.featuredImageId ? (
                                        <img className="w-32 sm:w-48 mr-8 sm:mr-16 rounded" src={_.find(form.images, {id: form.featuredImageId}).url} alt={form.name}/>
                                    ) : (
                                        <img className="w-32 sm:w-48 mr-8 sm:mr-16 rounded" src="/assets/images/ecommerce/admin-image-placeholder.png" alt={form.name}/>
                                    )}
                                </FuseAnimate>
                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {form.lastName ? form.lastName : ' '}
                                            &ensp;
                                            {form.firstName || form.lastName ? form.firstName : 'Nouveau Admin'}
                                        </Typography>
                                    </FuseAnimate>
                                   
                                </div>
                            </div>
                        </div>
                       
                    </div>
                )
            }
            contentToolbar={
                <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    classes={{root: "w-full h-64"}}
                >
                    <Tab className="h-64 normal-case" label="Informations"/>
                    <Tab className="h-64 normal-case" label="Admin Images"/>
                    
                </Tabs>
            }
            content={
                form && (
                    <div className="p-16 sm:p-24 max-w-2xl">
                        <Formsy 
                        onValidSubmit={handleSubmit}
                        onValid={enableButton}
                        onInvalid={disableButton}
                        ref={formRef}
                        className="flex flex-col overflow-hidden">

                            {tabValue === 0 &&
                            (
                                <div>

                                    
                                    <br />
                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            label="Username"
                                            autoFocus
                                            id="username"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            variant="outlined"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
                                            }}
                                            required
                                            fullWidth
                                        />
                                    </div>

                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            label="Nom"
                                            id="lastName"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            variant="outlined"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
                                            }}
                                            required
                                            fullWidth
                                        />
                                    </div>

                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            label="Prénom"
                                            id="firstName"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            variant="outlined"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
                                            }}
                                            required
                                            fullWidth
                                        />
                                    </div>

                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            label="Adresse 1"
                                            id="adresse1"
                                            name="adresse1"
                                            value={form.adresse1}
                                            onChange={handleChange}
                                            variant="outlined"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
                                            }}
                                            required
                                            fullWidth
                                        />
                                    </div>


                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            label="Adresse 2"
                                            id="adresse2"
                                            name="adresse2"
                                            value={form.adresse2}
                                            onChange={handleChange}
                                            variant="outlined"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
                                            }}
                                            fullWidth
                                        />
                                    </div>

                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            id="password"
                                            type="password"
                                            name="password"
                                            label="Mot de passe"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
                                            }}
                                          
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </div>

                                    <div className="flex">
                       
                                        <TextFieldFormsy
                                            className="mb-24"
                                            id="confirmpassword"
                                            type="password"
                                            name="confirmpassword"
                                            label="Confirmer mot de passe"
                                            validations="equalsField:password"
                                            validationErrors={{
                                                equalsField: 'Passwords not identique'
                                            }}
                                            
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </div>
                                   
                                
                                </div>
                            )}
                            {tabValue === 1 && (
                                <div>
                                    <input
                                        accept="image/*"
                                        className="hidden"
                                        id="button-file"
                                        type="file"
                                        onChange={handleUploadChange}
                                    />
                                    <div className="flex justify-center sm:justify-start flex-wrap">
                                        <label
                                            htmlFor="button-file"
                                            className={
                                                clsx(
                                                    classes.adminImageUpload,
                                                    "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                                                )}
                                        >
                                            <Icon fontSize="large" color="action">arrow_upward</Icon>
                                        </label>
                                        {form.images.map(media => (
                                            <div
                                                onClick={() => setFeaturedImage(media.id)}
                                                className={
                                                    clsx(
                                                        classes.adminImageItem,
                                                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",
                                                        (media.id === form.featuredImageId) && 'featured')
                                                }
                                                key={media.id}
                                            >
                                                <Icon className={classes.adminImageFeaturedStar}>star</Icon>
                                                <img className="max-w-none w-auto h-full" src={media.url} alt="admin"/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                             <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Button
                                    className="whitespace-no-wrap"
                                    variant="contained"
                                    type="submit"
                                    disabled={!isFormValid}
                                >
                                    Save
                                </Button>
                            </FuseAnimate>
                       </Formsy>
                    </div>
                )
            }
            innerScroll
        />
    )
}

export default withReducer('adminsApp', reducer)(Admin);
