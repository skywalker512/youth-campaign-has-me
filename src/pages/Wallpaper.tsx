import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-px2vw';
import { SwiperOptions } from 'swiper';
import Swiper from 'react-id-swiper';
import { animated, useTrail } from 'react-spring';
import { BackGroundImage, Container, LinkButton } from '../styled';
import WallpaperTitleImage from '../assets/WallpaperTitle.png';
import QCodeImage from '../assets/QCode.png';
import ArrowRightImage from '../assets/ArrowRight.png';
import ArrowLeftImage from '../assets/ArrowLeft.png';
import AvatarGenerateButtonImage from '../assets/AvatarGenerateButton.png';

const Wrapper = styled.div``;

const Title = styled(animated.div)`
  height: 71px;
  width: 554px;
  background-image: url(${WallpaperTitleImage});
  margin: 0 auto 40px auto;
  ${BackGroundImage}
`;

const CardWrapper = styled(animated.div)`
  height: 722px;
  width: 100vw;
  margin: 0 auto 38px auto;
  img {
    height: 722px;
    width: 418px;
  }
  .swiper-button-prev {
    height: 65px;
    width: 48px;
    background-image: url(${ArrowRightImage});
    left: 80px;
    &::after {
      content: '';
    }
    ${BackGroundImage}
  }
  .swiper-button-next {
    height: 65px;
    width: 48px;
    background-image: url(${ArrowLeftImage});
    right: 80px;
    &::after {
      content: '';
    }
    ${BackGroundImage}
  }
`;

const Card = styled.div`
  height: 722px;
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const Bottom = styled(animated.div)``;

const Tip = styled.div`
  height: 34px;
  width: 283px;
  background-image: url(${AvatarGenerateButtonImage});
  margin: 0 auto 40px auto;
  ${BackGroundImage}
`;

const creatText = (rank: number) => {
  const canvas = document.createElement('canvas');
  canvas.height = 60;
  canvas.width = 305;
  const ctx = canvas.getContext('2d');
  ctx!.font = '22px/22px "font"';
  //2. 使用`fillStyle`设置字体颜色。
  ctx!.fillStyle = '#3b175a';
  //3. 使用`fillText()`方法显示字体。
  ctx!.fillText(`青春战“疫”，我担当`, 0, 25);
  ctx!.fillText(`我是第`, 0, 55);
  const strNumber = ` ${rank.toString().padStart(6, '0')} `;
  // 量出第一个地方的字体
  const metrics1 = ctx!.measureText(`我是第`);
  ctx!.fillStyle = '#c03329';
  ctx!.font = 'bold 26px/6px "font"';
  // 量出第二个地方的字体
  const metrics2 = ctx!.measureText(strNumber);
  ctx!.fillText(strNumber, metrics1.width, 55);
  ctx!.fillStyle = '#3b175a';
  ctx!.font = '22px/22px "font"';
  ctx!.fillText(`位传递者`, metrics1.width + metrics2.width, 55);
  return canvas;
};

const data = [
  ['坚决打赢阻击战', '战斗员'],
  ['弘扬网络正能量', '宣传员'],
  ['以己之力温暖社会', '保障员'],
  ['坚持科学防护', '示范员'],
  ['与心同行，与爱同在', '心理员'],
];
const createImage = (imageUrl: string, numText: HTMLCanvasElement, content: string[]) =>
  new Promise<string>(resolve => {
      //    height: 614px;
      //     width: 394px;
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        //   height: 722px;
        //   width: 418px;
        const canvas = document.createElement('canvas');
        canvas.height = 722;
        canvas.width = 418;
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = '#cb5c7d';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(image, 11, 11, 394, 614);
        ctx!.fillStyle = '#f90404';
        ctx!.font = '18px/18px "font1"';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(content[0], canvas.width / 2 + 5, 395);
        ctx!.font = '70px/70px "font1"';
        ctx!.fillText(content[1], canvas.width / 2 + 5, 345);
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(11, 625, 394, 84);
        ctx!.drawImage(numText, 26, 635);
        const qcode = new Image();
        qcode.src = QCodeImage;
        qcode.onload = () => {
          ctx!.drawImage(qcode, 330, 633, 64, 64);
          resolve(canvas.toDataURL());
        };
      };
    },
  );

const WallpaperPage: React.FC = () => {
  const url = useRef<string[]>();
  const [loading, setLoading] = useState(false);
  const [Animation, setAnimation] = useTrail(3, () => ({
    from: {
      transform: 'translate3d(0,-100%,0)',
      opacity: 0,
    },
    config: {
      mass: 8,
      tension: 500,
      friction: 80,
    },
  }));
  useEffect(() => {
    const r = Number(localStorage.getItem('youth-campaign-rank'));
    const numText = creatText(r);
    url.current = Array(data.length);
    Promise.all(data.map((item, index) => new Promise(resolve => {
      createImage(require(`../assets/Wallpaper1.png`), numText, item).then(r => url.current![index] = r).then(resolve);
    }))).then(() => {
      setLoading(true);
      setAnimation({
        transform: 'translate3d(0,0%,0)',
        opacity: 1,
      });
    });
    // eslint-disable-next-line
  }, []);
  const swipeOptions: SwiperOptions = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };
  return (
    <Container>
      <Wrapper>
        <Title style={Animation[2]}/>
        <CardWrapper style={Animation[1]}>
          {
            loading && <Swiper {...swipeOptions}>{
              url!.current!.map((item, index) => <Card key={index}>
                <img src={item} alt={index.toString()}/>
              </Card>)
            }</Swiper>
          }
        </CardWrapper>
        <Bottom style={Animation[2]}>
          <Tip/>
        </Bottom>
        <Link to={'/'} replace={true}>
          <LinkButton/>
        </Link>
      </Wrapper>
    </Container>
  );
};

export default WallpaperPage;
