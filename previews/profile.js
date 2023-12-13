import { CanvasBuilder } from "../canvasbuilder";
import { Colors, Images, PREVIEW_HEIGHT, PREVIEW_WIDTH } from "../constants";
import getProfileDetails from "../fetchers/getProfileDetails";
import { parseERC3770 } from "../utils/address";
import { loadImage } from "canvas";
import { centerX } from "../utils/canvas";
import { arbitrumIcon } from "../icons/arbitrum";
import { optimismIcon } from "../icons/optimism";

const AVATAR_SIZE = 128;
const AVATAR_X = centerX(AVATAR_SIZE);
const AVATAR_Y = 80;

const PRIMARY_LABEL_SIZE = 40;
const PRIMARY_LABEL_Y = AVATAR_Y + AVATAR_SIZE + 50;

const SECONDARY_LABEL_SIZE = 24;
const SECONDARY_LABEL_Y = PRIMARY_LABEL_Y + PRIMARY_LABEL_SIZE + 16;

const BADGE_SIZE = 22;
const BADGE_RADIUS = 12;
const BADGE_PADDING = 12;

const MEMBER_BADGE_Y = SECONDARY_LABEL_Y + SECONDARY_LABEL_SIZE + 32;
const VOUCH_BADGE_Y = MEMBER_BADGE_Y + BADGE_SIZE + (BADGE_PADDING * 2) + 16;

const UNION_LOGO_Y = VOUCH_BADGE_Y + BADGE_SIZE + (BADGE_PADDING * 2) + 55;
const NETWORK_LOGO_Y = VOUCH_BADGE_Y + BADGE_SIZE + (BADGE_PADDING * 2) + 35;

export async function drawProfilePreview(req, res) {
  const erc3770Address = req.query.address;
  const [network, address] = parseERC3770(erc3770Address);

  console.log("Query params: ", { network, address });

  const details = await getProfileDetails(address, network);
  console.log("Profile details:", details);

  const { image, name, isMember, joinDate, voucherCount, voucheeCount } = details;

  const canvas = new CanvasBuilder(PREVIEW_WIDTH, PREVIEW_HEIGHT);
  canvas.setBackground(Colors.Background);

  // Avatar
  const avatar = await loadImage(image);
  canvas.save();
  canvas.drawClipCircle(AVATAR_X, AVATAR_Y, AVATAR_SIZE);
  canvas.drawImage(avatar, AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE);
  canvas.restore();

  if (isMember) {
    const tick = await loadImage(Images.Tick);
    canvas.drawCircle(AVATAR_X - 8, AVATAR_Y - 8, AVATAR_SIZE + 16, null, "#3B82F6", 5);
    canvas.drawCircle(AVATAR_X+AVATAR_SIZE-28, AVATAR_Y+AVATAR_SIZE-28, 32, "#3B82F6", "#3B82F6");
    canvas.drawImage(tick, AVATAR_X+AVATAR_SIZE-23, AVATAR_Y+AVATAR_SIZE-18, 20, 15);
  }

  // Primary label
  canvas.drawCenterText(name, PRIMARY_LABEL_Y, "#292524", PRIMARY_LABEL_SIZE, 500);

  // Secondary label
  canvas.drawCenterText(address, SECONDARY_LABEL_Y, "#A8A29E", SECONDARY_LABEL_SIZE, 500);

  // Member status
  if (isMember) {
    if (joinDate) {
      const formatted = joinDate.toLocaleDateString("en-us", {
        year: "numeric", month: "short", day: "numeric",
      });

      canvas.drawRoundRectText(MEMBER_BADGE_Y, `Member since ${formatted}`, "#3B82F6", BADGE_SIZE, "#DBEAFE", BADGE_RADIUS, BADGE_PADDING);
    } else {
      canvas.drawRoundRectText(MEMBER_BADGE_Y, "Member", "#3B82F6", BADGE_SIZE, "#DBEAFE", BADGE_RADIUS, BADGE_PADDING);
    }
  } else {
    canvas.drawRoundRectText(MEMBER_BADGE_Y, "Not a member", "#F59E0B", BADGE_SIZE, "#FEF3C7", BADGE_RADIUS, BADGE_PADDING);
  }

  // Vouch info
  canvas.drawRoundRectText(VOUCH_BADGE_Y, `Receiving ${voucherCount} vouches · Providing ${voucheeCount} vouches`, "#78716C", BADGE_SIZE, "#F5F5F4", BADGE_RADIUS, BADGE_PADDING);

  const unionLogo = await loadImage(Images.Union)
  canvas.drawImage(unionLogo, 30, UNION_LOGO_Y, 116, 50);

  switch (network) {
    case "optimism":
      canvas.drawImage(await loadImage(optimismIcon), PREVIEW_WIDTH - 65 - 30, NETWORK_LOGO_Y, 65, 65);
      break;

    case "arbitrum":
      canvas.drawImage(await loadImage(arbitrumIcon), PREVIEW_WIDTH - 65 - 30, NETWORK_LOGO_Y, 65, 65);
      break;
  }

  canvas.pipeToResponse(res);
}