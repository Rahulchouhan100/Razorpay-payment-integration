import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Heading,
  Text,
  ButtonGroup,
  Button,
  Image,
  useDisclosure,
  Input,
  useStatStyles,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = React.useState([]);
  const [cart, setCart] = React.useState([]);
  const [cartItems, setCartItems] = React.useState(
    localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
  );
  const [getAccesskey, setGetAccessKey] = React.useState("");
  const [orderID, setOrderID] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const productData = async () => {
    try {
      const data = await axios.get("https://fakestoreapi.com/products");
      setData(data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const priceTotal = cart?.reduce((acc, curr) => {
    return acc + curr?.price;
  }, 0);

  const addToCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
  };

  let all = cart
    ? cart?.map((data) => {
        return data?.title;
      })
    : [];
  let allImage = cart?.map((data) => {
    return data?.image;
  });

  const orderProduct = async () => {
    try {
      const accessKeyResponse = await axios.post(
        `http://localhost:5000/acces-key?name=sourabh&password=sundaynight11:00`
      );
      const accessKey = accessKeyResponse?.data?.result?.key_id;
      setGetAccessKey(accessKey);
      const orderResponse = await axios.post("http://localhost:5000/order", {
        currency: "INR",
        amount: priceTotal,
      });
      const orderID = orderResponse?.data?.result?.id;
      setOrderID(orderID);
      const options = {
        key: getAccesskey,
        amount: priceTotal * 100,
        currency: "INR",
        name: all[0],
        description:
          "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image: allImage[0],
        order_id: orderID,
        callback_url: "http://localhost:5000/payment-verification",
        // prefill: {
        //   name: "Rahul Kumar",
        //   email: "rahul.kumar@example.com",
        //   contact: "9000090000",
        // },
        // notes: {
        //   address: "Razorpay Corporate Office",
        // },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    productData();
    // accessKey();
    // rasorPayIntegrate();
  }, []);
  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <h1>Kharid loo</h1>
        <div onClick={onOpen}>
          Cart Details <span>{cart?.length}</span>
        </div>
      </nav>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data?.map((data, index) => {
          return (
            <Card maxW="sm" key={data?.id}>
              <CardBody>
                <Image
                  src={`${data?.image}`}
                  alt="Green double couch with wooden legs "
                  borderRadius="lg"
                  style={{ width: "150px", height: "150px" }}
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{data?.title || "-"}</Heading>
                  <Text>
                    {data?.description.length > 200
                      ? data?.description.slice(0, 100) + "..."
                      : data?.description}
                  </Text>
                  <Text color="blue.600" fontSize="2xl">
                    ₹{data?.price}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button variant="solid" colorScheme="blue">
                    Buy now
                  </Button>
                  <Button
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => {
                      addToCart(data);
                      onOpen();
                    }}
                  >
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Your Items</DrawerHeader>

          <DrawerBody>
            {cart?.map((item, i) => (
              <div
                style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
              >
                <div>
                  <img src={item?.image} alt="" style={{ width: "50px" }} />
                </div>
                <div>
                  <h3>{item?.title}</h3>
                  <p>{item?.price}</p>
                </div>
              </div>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3}>
              Total {priceTotal}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                onClose();
                orderProduct();
              }}
            >
              Payment
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Home;
