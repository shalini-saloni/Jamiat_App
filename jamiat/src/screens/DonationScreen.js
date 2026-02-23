import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];
const DONATION_TYPES = [
  { key: 'Zakat',  label: 'Zakat',  icon: 'mosque' },
  { key: 'Sadaqa', label: 'Sadaqa', icon: 'hand-holding-heart' },
  { key: 'Lillah', label: 'Lillah', icon: 'heart' },
];
const PAYMENT_METHODS = [
  { key: 'upi',     label: 'UPI (GPay, PhonePe, etc.)', icon: 'phone-portrait-outline' },
  { key: 'card',    label: 'Credit / Debit Card',        icon: 'card-outline' },
  { key: 'netbank', label: 'Net Banking',                icon: 'laptop-outline' },
];

export default function DonationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user, addDonation } = useApp();
  const campaign  = route?.params?.campaign;
  const initType  = route?.params?.donationType || 'Zakat';

  const [selectedType,   setSelectedType]   = useState(initType);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount,   setCustomAmount]   = useState('');
  const [recurring,      setRecurring]      = useState(false);
  const [paymentMethod,  setPaymentMethod]  = useState('upi');
  const [processing,     setProcessing]     = useState(false);
  const [success,        setSuccess]        = useState(false);
  const [finalAmount,    setFinalAmount]    = useState(0);

  const currentAmount = customAmount ? (parseInt(customAmount) || 0) : selectedAmount;

  const handleComplete = () => {
    if (currentAmount < 1) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
      return;
    }
    setProcessing(true);
    setTimeout(async () => {
      setProcessing(false);
      setFinalAmount(currentAmount);
      await addDonation({
        name:      campaign ? campaign.title : `${selectedType} Donation`,
        amount:    currentAmount,
        type:      selectedType,
        campaign:  campaign?.title || null,
        icon:      selectedType === 'Zakat' ? 'moon' : selectedType === 'Sadaqa' ? 'heart' : 'star',
        recurring,
      });
      setSuccess(true);
    }, 1400);
  };

  const goHome = () => {
    if (navigation.canGoBack()) {
      navigation.popToTop(); 
    } else {
      navigation.navigate('Tabs');
    }
  };

  const goImpact = () => {
    if (navigation.canGoBack()) {
      navigation.popToTop();
    }
    navigation.navigate('MyImpact');
  };

  if (success) {
    return (
      <View style={[styles.successBg, { paddingTop: insets.top }]}>
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Jazakallah Khayran!</Text>
          <Text style={styles.successSub}>Your donation of</Text>
          <Text style={styles.successAmount}>₹{finalAmount.toLocaleString()}</Text>
          <Text style={styles.successType}>{selectedType} • {campaign?.title || 'General Donation'}</Text>
          <Text style={styles.successMsg}>
            May Allah accept your contribution and multiply your reward. Ameen.
          </Text>
          <TouchableOpacity style={styles.impactBtn} onPress={goImpact}>
            <Text style={styles.impactBtnText}>View My Impact →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : goHome()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Support Jamiat</Text>
          {campaign && <Text style={styles.headerSub} numberOfLines={1}>{campaign.title}</Text>}
        </View>
        <View style={styles.secureBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#1B8A4C" />
          <Text style={styles.secureText}>SECURE</Text>
        </View>
      </View>

      {/* Steps indicator */}
      <View style={styles.stepsRow}>
        {['Amount', 'Payment', 'Confirm'].map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, i === 0 ? styles.stepActive : styles.stepInactive]}>
              <Text style={[styles.stepNum, i === 0 && { color: '#fff' }]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>{s}</Text>
            {i < 2 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Campaign banner */}
        {campaign && (
          <View style={[styles.campaignBanner, { backgroundColor: campaign.color || '#1B6B3A' }]}>
            <Text style={{ fontSize: 22 }}>{campaign.emoji || '🌱'}</Text>
            <Text style={styles.campaignBannerText} numberOfLines={1}>{campaign.title}</Text>
          </View>
        )}

        {/* Donation Type */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>DONATION TYPE</Text>
            {selectedType === 'Zakat' && (
              <View style={styles.taxBadge}><Text style={styles.taxText}>80G TAX BENEFIT</Text></View>
            )}
          </View>
          <View style={styles.typeRow}>
            {DONATION_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setSelectedType(t.key)}
                style={[styles.typeBtn, selectedType === t.key && styles.typeBtnActive]}
              >
                <FontAwesome5 name={t.icon} size={18} color={selectedType === t.key ? '#fff' : '#1B8A4C'} />
                <Text style={[styles.typeBtnText, selectedType === t.key && styles.typeBtnTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SELECT AMOUNT</Text>
          <View style={styles.amountGrid}>
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = selectedAmount === amt && !customAmount;
              return (
                <TouchableOpacity
                  key={amt}
                  onPress={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  style={[styles.amountBtn, isSelected && styles.amountBtnActive]}
                >
                  <Text style={[styles.amountText, isSelected && styles.amountTextActive]}>
                    ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.customRow}>
            <Ionicons name="create-outline" size={15} color="#aaa" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.customInput}
              placeholder="₹ Enter custom amount"
              placeholderTextColor="#bbb"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(v) => { setCustomAmount(v); setSelectedAmount(0); }}
            />
          </View>
          {currentAmount > 0 && (
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>You are donating </Text>
              <Text style={styles.previewAmount}>₹{currentAmount.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Recurring */}
        <View style={styles.card}>
          <View style={[styles.recurringRow, recurring && styles.recurringRowActive]}>
            <View style={styles.recurringLeft}>
              <View style={styles.recurringIcon}>
                <Ionicons name="refresh" size={17} color="#1B8A4C" />
              </View>
              <View>
                <Text style={styles.recurringTitle}>Monthly Recurring</Text>
                <Text style={styles.recurringSubtitle}>Automate your monthly charity</Text>
              </View>
            </View>
            <Switch
              value={recurring}
              onValueChange={setRecurring}
              trackColor={{ false: '#ddd', true: '#1B8A4C' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Donor details */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>DONOR DETAILS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{user?.name || '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{user?.email || '—'}</Text>
          </View>
          {user?.phone ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>
          ) : null}
        </View>

        {/* Payment method */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SECURE PAYMENT</Text>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.key}
              onPress={() => setPaymentMethod(pm.key)}
              style={[styles.payRow, paymentMethod === pm.key && styles.payRowActive]}
            >
              <View style={[styles.radio, paymentMethod === pm.key && styles.radioActive]}>
                {paymentMethod === pm.key && <View style={styles.radioDot} />}
              </View>
              <Ionicons name={pm.icon} size={17} color={paymentMethod === pm.key ? '#1B8A4C' : '#888'} style={{ marginRight: 10 }} />
              <Text style={[styles.payLabel, paymentMethod === pm.key && { color: '#1B8A4C', fontWeight: '700' }]}>
                {pm.label}
              </Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.encryptNote}>🔒 100% Secure SSL Encrypted Transaction</Text>
        </View>

        {/* Summary + button */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelText}>TOTAL AMOUNT</Text>
            <Text style={styles.summaryType}>TYPE: {selectedType.toUpperCase()}</Text>
          </View>
          <Text style={styles.summaryAmount}>₹{currentAmount.toLocaleString()}.00</Text>
          {recurring && <Text style={styles.recurringNote}>↻ Monthly auto-debit will be enabled</Text>}
        </View>

        <TouchableOpacity
          style={[styles.completeBtn, (processing || currentAmount < 1) && styles.completeBtnDisabled]}
          onPress={handleComplete}
          disabled={processing || currentAmount < 1}
        >
          <Text style={styles.completeBtnText}>
            {processing ? 'Processing...' : 'Complete Donation →'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Success
  successBg: { flex: 1, backgroundColor: '#F0FFF4', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: { backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, elevation: 6 },
  successEmoji: { fontSize: 52, marginBottom: 14 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1B8A4C', marginBottom: 10 },
  successSub: { fontSize: 13, color: '#888', marginBottom: 2 },
  successAmount: { fontSize: 38, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
  successType: { fontSize: 13, color: '#888', marginBottom: 16 },
  successMsg: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  impactBtn: { backgroundColor: '#1B8A4C', paddingVertical: 14, borderRadius: 13, alignItems: 'center', width: '100%', marginBottom: 10 },
  impactBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  homeBtn: { borderWidth: 1.5, borderColor: '#1B8A4C', paddingVertical: 13, borderRadius: 13, alignItems: 'center', width: '100%' },
  homeBtnText: { color: '#1B8A4C', fontWeight: '700', fontSize: 15 },

  // Form
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#888', marginTop: 1 },
  secureBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  secureText: { fontSize: 10, color: '#1B8A4C', fontWeight: '800' },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#fff', paddingHorizontal: 20 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  stepActive: { backgroundColor: '#1B8A4C' },
  stepInactive: { backgroundColor: '#E0E0E0' },
  stepNum: { fontSize: 12, fontWeight: '700', color: '#aaa' },
  stepLabel: { fontSize: 11, color: '#aaa', marginRight: 6 },
  stepLabelActive: { color: '#1B8A4C', fontWeight: '700' },
  stepLine: { width: 28, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  campaignBanner: { marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  campaignBannerText: { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1 },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  taxBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 12 },
  taxText: { fontSize: 9, color: '#F57C00', fontWeight: '800' },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#E8F5E9', backgroundColor: '#FAFFF9', gap: 6 },
  typeBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  typeBtnText: { fontSize: 12, color: '#1B8A4C', fontWeight: '600' },
  typeBtnTextActive: { color: '#fff' },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  amountBtn: { width: '30%', paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center' },
  amountBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  amountText: { fontSize: 14, fontWeight: '600', color: '#555' },
  amountTextActive: { color: '#fff' },
  customRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  customInput: { flex: 1, fontSize: 14, color: '#333' },
  previewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  previewLabel: { fontSize: 13, color: '#888' },
  previewAmount: { fontSize: 17, fontWeight: '800', color: '#1B8A4C' },
  recurringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FFF9', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8F5E9' },
  recurringRowActive: { borderColor: '#1B8A4C' },
  recurringLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recurringIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  recurringTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  recurringSubtitle: { fontSize: 11, color: '#999', marginTop: 1 },
  editLink: { color: '#1B8A4C', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 13, color: '#333', fontWeight: '500', flex: 1, textAlign: 'right' },
  payRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#F0F0F0', marginBottom: 8 },
  payRowActive: { borderColor: '#1B8A4C', backgroundColor: '#F0FFF4' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#ccc', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#1B8A4C' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B8A4C' },
  payLabel: { flex: 1, fontSize: 14, color: '#555' },
  encryptNote: { textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 6 },
  summarySection: { marginHorizontal: 16, marginTop: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabelText: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.5 },
  summaryType: { fontSize: 11, color: '#999' },
  summaryAmount: { fontSize: 30, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
  recurringNote: { fontSize: 12, color: '#1B8A4C', fontWeight: '500', marginBottom: 10 },
  completeBtn: { marginHorizontal: 16, marginTop: 10, backgroundColor: '#1B8A4C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  completeBtnDisabled: { opacity: 0.55 },
  completeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
