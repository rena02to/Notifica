import React, { useEffect, useState } from "react";
import style from './Home.module.scss';
import Navbar from "../../components/Navbar";
import { Form, Formik, Field, FieldProps } from "formik";
import { TextField, Button, CircularProgress } from "@mui/material";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

interface Notified{
    name: string;
    email: string;
    telephone: string;
    address: string;
}

interface NotifiedData extends Notified{
    id: number;
}

interface NotificationBase{
    title: string;
    description: string;
    audience: string;
}

interface NotificationForm extends NotificationBase{
    time: string;
}

interface Notification extends NotificationBase{
    id: number;
    status: string;
    audience_time: string;
    audience_date: string;
    created_at: string;
    updated_at: string;
    notified: NotifiedData | null;
}

export default function Notificacoes() {
    const [ notifications, setNotifications ] = useState<Notification[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [ notificationId, setNotificationId ] = useState<number | null>(null);
    const [ poupupNotification, setPoupupNotification ] = useState(false);
    const [ poupupNotified, setPoupupNotified ] = useState(false);
    const [ pendingInfo, setPendingInfo ] = useState(false);
    const [ openConfirmDelete, setOpenConfirmDelete ] = useState(false);
    const [ notified, setNotified ] = useState<NotifiedData | null>(null);
    const [ initialValuesNotification, setInitialValuesNotification ] = useState<NotificationForm>({
        title: "",
        audience: "",
        description: "",
        time: "",
    });
    const validationSchema = Yup.object({
        title: Yup.string().required("Título é obrigatório").max(155, "Máximo de 155 caracteres"),
        audience: Yup.date().required("Data da audiência é obrigatória").min(new Date(), "A data da audiência não pode ser no passado"),
        time: Yup.string().required("Hora da audiência é obrigatória"),
        description: Yup.string().required("Descrição é obrigatória").max(500, "Máximo de 500 caracteres"),
    });
    const [ initialValuesNotified, setInitialValuesNotified ] = useState<Notified>({
        name: "",
        email: "",
        telephone: "",
        address: "",
    });
    const validationSchemaNotified = Yup.object({
        name: Yup.string().required("Nome é obrigatório").test("has-two-words", "Informe nome e sobrenome",(value) => !!value && value.trim().split(" ").length >= 2).max(255, "Máximo de 255 caracteres"),
        email: Yup.string().email('E-mail inválido').required("E-mail é obrigatório").max(255, "Máximo de 255 caracteres"),
        telephone: Yup.string().required("Telefone é obrigatório").max(16, "Máximo de 16 caracteres"),
        address: Yup.string().required("Endereço é obrigatório").max(255, "Máximo de 255 caracteres"),
    });

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 10) {
            return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3").trimEnd();
        } else {
            return digits.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3").trimEnd();
        }
    };

    const getNotifications = async() => {
        setLoading(true);
        setNotifications([]);
        try{
            const response = await fetch("http://localhost:8000/api/notifications/");
            if(response.ok){
                const data = await response.json();
                setNotifications(data);
            }else{
                toast.error("Ocorreu um erro ao buscar as notificações!");
            }
        }catch{}finally{
            setLoading(false);
        }
    }

    const createNotification = async(values: NotificationForm) => {
        setLoading(true);
        try{
            const payload = {
                title: values.title,
                description: values.description,
                audience: `${values.audience}T${values.time}`,
            };

            let method = "";
            let url = "";
            if(notificationId){
                method="PATCH";
                url=`http://localhost:8000/api/notifications/${notificationId}/`
            }else{
                method="POST"
                url="http://localhost:8000/api/notifications/"
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if(response.ok){
                if(notificationId){
                    toast.success("Notificação atualizada com sucesso!");
                }else{
                    toast.success("Notificação criada com sucesso!");
                }
            }else if(response.status === 404){
                toast.error("Notificação não encontrada!");
            }else{
                if(notificationId){
                    toast.error("Ocorreu um erro ao atualizar a notificação!");
                }else{
                    toast.error("Ocorreu um erro ao criar a notificação!");
                }
            }
        }catch{
            if(notificationId){
                toast.error("Ocorreu um erro ao atualizar a notificação!");
            }else{
                toast.error("Ocorreu um erro ao criar a notificação!");
            }
        }finally{
            setLoading(false);
            setPoupupNotification(false);
            setInitialValuesNotification({
                title: "",
                audience: "",
                description: "",
                time: "",
            });
            getNotifications();
        }
    }

    const createNotified = async(values: Notified) => {
        setLoading(true);
        try{
            const payload = {
                name: values.name,
                telephone: values.telephone,
                email: values.email,
                address: values.address,
            };

            let url = "";
            if(notified && notified.id){
                url=`http://localhost:8000/api/notifications/notified/${notified.id}/`
            }else{
                url=`http://localhost:8000/api/notifications/${notificationId}/insert_notified/`
            }

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if(response.ok){
                if(notified && notified.id){
                    toast.success("Notificado atualizado com sucesso!");
                }else if(response.status === 404){
                    toast.error("Notificado não encontrada!");
                }else{
                    toast.success("Notificado vinculado com sucesso!");
                }
            }else{
                if(notified && notified.id){
                    toast.error("Ocorreu um erro ao atualizar o notificado!");
                }else{
                    toast.error("Ocorreu um erro ao vincular o notificado!");
                }
            }
        }catch{
            if(notified && notified.id){
                toast.error("Ocorreu um erro ao atualizar o notificado!");
            }else{
                toast.error("Ocorreu um erro ao vincular o notificado!");
            }
        }finally{
            setLoading(false);
            setPoupupNotified(false);
            setNotified(null);
            setNotificationId(null);
            setInitialValuesNotified({
                name: "",
                email: "",
                telephone: "",
                address: "",
            });
            getNotifications();
        }
    }

    const finishNotification = async() => {
        setLoading(true);
        try{
            const response = await fetch(`http://localhost:8000/api/notifications/finish/${notificationId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if(response.ok){
                toast.success("Notificação finalizada com sucesso!");
            }else if(response.status === 404){
                toast.error("Notificação não encontrada!");
            }else{
                toast.error("Ocorreu um erro ao finalizar a notificação!");
            }
        }catch{
            toast.error("Ocorreu um erro ao finalizar a notificação!");
        }finally{
            setLoading(false);
            setPendingInfo(false);
            getNotifications();
        }
    }

    const deleteNotification = async() => {
        setLoading(true);
        try{
            const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if(response.ok){
                toast.success("Notificação deletada com sucesso!");
            }else if(response.status === 404){
                toast.error("Notificação não encontrada!");
            }else{
                toast.error("Ocorreu um erro ao deletar a notificação!");
            }
        }catch{
            toast.error("Ocorreu um erro ao deletar a notificação!");
        }finally{
            setLoading(false);
            setPendingInfo(false);
            getNotifications();
            setNotificationId(null);
        }
    }

    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <>
            {poupupNotification ?
                <div className={style.poupupNotification}>
                    <Formik initialValues={initialValuesNotification} enableReinitialize validationSchema={validationSchema} onSubmit={createNotification}>
                        {({ isValid, dirty, errors, touched }) => (
                            <Form>
                                <IconButton
                                    onClick={() => {setPoupupNotification(false);setNotificationId(null); setInitialValuesNotification({title: "", audience: "", description: "", time: "",})}}
                                    size="small"
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <p className={style.title}>Nova notificação</p>
                                <Field name="title">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Título"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            inputProps={{ maxLength: 155 }}
                                        />
                                    )}
                                </Field>
                                <Field name="audience">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Data da audiência"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Field name="time">
                                    {({ field }: any) => (
                                        <TextField
                                            {...field}
                                            type="time"
                                            label="Hora da audiência"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={Boolean(field.value && errors.time)}
                                        />
                                    )}
                                </Field>
                                <Field name="description">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Descrição"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            inputProps={{ maxLength: 500 }}
                                        />
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading || !isValid || !dirty}
                                    fullWidth
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {notificationId ?
                                        (loading ? "Editando..." : "Editar Notificação")
                                        :
                                        (loading ? "Criando..." : "Criar Notificação")
                                    }
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
                : null
            }
            {poupupNotified ?
                <div className={style.poupupNotified}>
                    <Formik initialValues={initialValuesNotified} enableReinitialize validationSchema={validationSchemaNotified} onSubmit={createNotified}>
                        {({ isValid, dirty, errors, touched, setFieldValue }) => (
                            <Form>
                                <IconButton
                                    onClick={() => {setPoupupNotified(false); setPoupupNotified(false);setNotificationId(null);}}
                                    size="small"
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <p className={style.title}>Vincular notificado</p>
                                <Field name="name">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Nome"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            inputProps={{ maxLength: 255 }}
                                        />
                                    )}
                                </Field>
                                <Field name="email">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="E-mail"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            inputProps={{ maxLength: 255 }}
                                        />
                                    )}
                                </Field>
                                <Field name="telephone">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Telefone"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            onChange={(e) => setFieldValue("telephone", formatPhone(e.target.value))}
                                            inputProps={{ maxLength: 15 }}
                                        />
                                    )}
                                </Field>
                                <Field name="address">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Endereço"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading || !isValid || !dirty}
                                    fullWidth
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {notified && notified.id?
                                        (loading ? "Editando..." : "Editar notificado")
                                        :
                                        (loading ? "Vinculando..." : "Vincular notificado")
                                    }
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
                : null
            }
            {pendingInfo?
                <div className={style.pendingInfo}>
                    <div className={style.div}>
                        <IconButton
                            onClick={() => {setNotified(null); setPendingInfo(false);setNotificationId(null);}}
                            size="small"
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <p className={style.title}>Pendente de informações?</p>
                        <div className={style.buttons}>
                            <Button
                                variant="contained"
                                sx={{
                                width: "48%",
                                backgroundColor: "red",
                                color: "white",
                                "&:hover": { backgroundColor: "darkred" },
                                }}
                                onClick={()=>{
                                    setInitialValuesNotified(notified ? notified : initialValuesNotified);
                                    setPendingInfo(false);
                                    setPoupupNotified(true);
                                }}
                            >
                                Sim
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                width: "48%",
                                backgroundColor: "gray",
                                color: "white",
                                "&:hover": { backgroundColor: "darkgray" },
                                }}
                                onClick={()=>{setNotified(null); finishNotification();}}
                            >
                                Não
                            </Button>
                            </div>
                    </div>
                </div>
                :null
            }
            {openConfirmDelete?
                <div className={style.pendingInfo}>
                    <div className={style.div}>
                        <IconButton
                            onClick={() => {setOpenConfirmDelete(false);setNotificationId(null);}}
                            size="small"
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <p className={style.title}>Excluir permanentemente?</p>
                        <div className={style.buttons}>
                            <Button
                                variant="contained"
                                sx={{
                                width: "48%",
                                backgroundColor: "red",
                                color: "white",
                                "&:hover": { backgroundColor: "darkred" },
                                }}
                                onClick={()=>{
                                    setOpenConfirmDelete(false);
                                    deleteNotification();
                                }}
                            >
                                Sim
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                width: "48%",
                                backgroundColor: "gray",
                                color: "white",
                                "&:hover": { backgroundColor: "darkgray" },
                                }}
                                onClick={()=>{
                                    setOpenConfirmDelete(false);
                                }}
                            >
                                Não
                            </Button>
                            </div>
                    </div>
                </div>
                :null
            }
            <div className={style.notifications}>
                <Navbar/>
                <div className={style.intern}>
                    <p className={style.title}>Notificações Judiciais</p>
                    <div className={style.actions}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => setPoupupNotification(true)}
                        >
                            Criar Notificação
                        </Button>
                    </div>
                    <div className={style.table}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ações</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th>Endereço</th>
                                    <th>Titúlo</th>
                                    <th>Descrição</th>
                                    <th>Data da audiência</th>
                                    <th>Status</th>
                                    <th>Última atualização</th>
                                    <th>Criado em</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((notification, index) => (
                                    <tr key={index}>
                                        <td>
                                            <IconButton color="error" aria-label="Deletar" onClick={() => {setNotificationId(notification.id); setOpenConfirmDelete(true)}}>
                                                <DeleteIcon />
                                            </IconButton>
                                            {notification.status !== "Concluído" ?
                                                <IconButton color="primary" aria-label="Editar arquivo" onClick={()=>{setNotificationId(notification.id); setInitialValuesNotification({title: notification.title, description: notification.description, time: notification.audience_time, audience: notification.audience_date}); setPoupupNotification(true);}}>
                                                    <EditNoteIcon />
                                                </IconButton>
                                                : null
                                            }
                                        </td>
                                        <td>
                                            {notification.notified ?
                                                notification.notified.name :
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => {setNotificationId(notification.id); setPoupupNotified(true)}}
                                                >
                                                    Não vinculado
                                                </Button>
                                            }
                                        </td>
                                        <td>
                                            {
                                                notification.notified ?
                                                notification.notified.email : 
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => {setNotificationId(notification.id); setPoupupNotified(true)}}
                                                >
                                                    Não vinculado
                                                </Button>
                                            }
                                        </td>
                                        <td>
                                            {
                                                notification.notified ? 
                                                notification.notified.telephone :
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => {setNotificationId(notification.id); setPoupupNotified(true)}}
                                                >
                                                    Não vinculado
                                                </Button>
                                            }
                                        </td>
                                        <td>
                                            {
                                                notification.notified ?
                                                notification.notified.address :
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => {setNotificationId(notification.id); setPoupupNotified(true)}}
                                                >
                                                    Não vinculado
                                                </Button>
                                            }
                                        </td>
                                        <td>{notification.title}</td>
                                        <td>{notification.description}</td>
                                        <td>{notification.audience}</td>
                                        <td>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                disabled={notification.status !== "Em Validação"}
                                                style={{
                                                    cursor:notification.status === "Em Validação" ? "pointer" : "default",
                                                    color:notification.status !== "Em Andamento" ? "white" : "black",
                                                    backgroundColor:
                                                        notification.status === "Em Validação"
                                                        ? "#FFD700"
                                                        : notification.status === "Em Andamento"
                                                        ? "#2196F3"
                                                        : notification.status === "Concluído"
                                                        ? "#4CAF50"
                                                        : "#B0B0B0",
                                                    }
                                                }
                                                onClick={()=> {setNotificationId(notification.id); setNotified(notification.notified); setPendingInfo(true);}}
                                            >
                                                {notification.status}
                                            </Button>
                                        </td>
                                        <td>{notification.updated_at}</td>
                                        <td>{notification.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
